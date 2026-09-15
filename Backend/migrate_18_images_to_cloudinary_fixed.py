import csv
import os
import sys
from pathlib import Path

import cloudinary
import cloudinary.uploader
import psycopg

PROJECT_ROOT = Path(r"S:\JavaProject\Lost-And-Found-Portal")
UPLOADS_DIR = PROJECT_ROOT / "uploads"
CSV_PATH = PROJECT_ROOT / "Backend" / "lost_items.csv"

EXPECTED_COUNT = 18
CLOUDINARY_PREFIX = "https://res.cloudinary.com/"


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing environment variable: {name}")
    return value


def normalize_postgres_url(url: str) -> str:
    if url.startswith("jdbc:postgresql://"):
        return url[len("jdbc:"):]
    return url


def postgres_connection(database_url: str, username: str, password: str):
    return psycopg.connect(
        normalize_postgres_url(database_url),
        user=username,
        password=password,
    )


def load_items():
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"CSV not found: {CSV_PATH}")

    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    if len(rows) != EXPECTED_COUNT:
        raise RuntimeError(
            f"Expected {EXPECTED_COUNT} rows in lost_items.csv, found {len(rows)}."
        )

    if not rows or "id" not in rows[0] or "image_url" not in rows[0]:
        raise RuntimeError("lost_items.csv must contain id and image_url columns.")

    return rows


def main():
    database_url = require_env("NEON_DB_URL")
    db_username = require_env("NEON_DB_USERNAME")
    db_password = require_env("NEON_DB_PASSWORD")

    cloud_name = require_env("CLOUDINARY_CLOUD_NAME")
    api_key = require_env("CLOUDINARY_API_KEY")
    api_secret = require_env("CLOUDINARY_API_SECRET")

    rows = load_items()

    if not UPLOADS_DIR.exists():
        raise FileNotFoundError(f"Uploads folder not found: {UPLOADS_DIR}")

    # Exact filename -> local file path
    local_files = {
        file.name: file
        for file in UPLOADS_DIR.iterdir()
        if file.is_file()
    }

    print("Checking all 18 image files...")
    missing = []

    for row in rows:
        filename = Path(row["image_url"]).name
        if filename not in local_files:
            missing.append(f"ID {row['id']}: {filename}")

    if missing:
        print("MISSING IMAGE FILES:")
        for item in missing:
            print(f"  {item}")
        raise RuntimeError(
            "Not all 18 original image files were found. "
            "No database changes were made."
        )

    print("All 18 original image files found. ✅")

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )

    print("\nChecking Neon records before changing image_url values...")

    conn = postgres_connection(database_url, db_username, db_password)

    try:
        with conn.cursor() as cur:
            for row in rows:
                item_id = int(row["id"])
                expected_filename = row["image_url"]

                cur.execute(
                    "SELECT image_url FROM lost_items WHERE id = %s",
                    (item_id,),
                )

                result = cur.fetchone()

                if result is None:
                    raise RuntimeError(
                        f"Neon lost_items row ID {item_id} does not exist."
                    )

                current_url = result[0]

                # Safe rerun support: already migrated items are allowed.
                if (
                    isinstance(current_url, str)
                    and current_url.startswith(CLOUDINARY_PREFIX)
                ):
                    continue

                if current_url != expected_filename:
                    raise RuntimeError(
                        f"Safety stop for ID {item_id}.\n"
                        f"Expected: {expected_filename}\n"
                        f"Actual:   {current_url}\n"
                        "No database changes were made."
                    )

        print("Neon records passed safety checks. ✅")
    finally:
        conn.close()

    print("\nUploading original images to Cloudinary...")

    uploaded = []

    for row in rows:
        item_id = int(row["id"])
        filename = Path(row["image_url"]).name
        local_path = local_files[filename]

        # Check whether this item was already migrated.
        conn = postgres_connection(database_url, db_username, db_password)
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT image_url FROM lost_items WHERE id = %s",
                    (item_id,),
                )
                current_url = cur.fetchone()[0]
        finally:
            conn.close()

        if (
            isinstance(current_url, str)
            and current_url.startswith(CLOUDINARY_PREFIX)
        ):
            print(f"  ↳ ID {item_id}: already on Cloudinary, skipping upload.")
            uploaded.append((item_id, filename, current_url))
            continue

        # Keep the original filename as the Cloudinary public ID.
        public_id = Path(filename).stem

        result = cloudinary.uploader.upload(
            str(local_path),
            folder="findlost/legacy-items",
            public_id=public_id,
            resource_type="image",
            overwrite=True,
            unique_filename=False,
        )

        secure_url = result.get("secure_url")

        if not secure_url:
            raise RuntimeError(
                f"Cloudinary did not return secure_url for ID {item_id}."
            )

        uploaded.append((item_id, filename, secure_url))
        print(f"  ✓ ID {item_id}  {filename}")

    if len(uploaded) != EXPECTED_COUNT:
        raise RuntimeError(
            f"Expected {EXPECTED_COUNT} uploaded/mapped images, got {len(uploaded)}."
        )

    print(
        f"\nCloudinary upload stage complete: "
        f"{len(uploaded)}/{EXPECTED_COUNT} ✅"
    )

    print("\nUpdating Neon image_url values...")

    # All Neon updates happen in one transaction.
    conn = postgres_connection(database_url, db_username, db_password)

    try:
        with conn:
            with conn.cursor() as cur:
                for item_id, _, secure_url in uploaded:
                    cur.execute(
                        """
                        UPDATE lost_items
                        SET image_url = %s
                        WHERE id = %s
                        """,
                        (secure_url, item_id),
                    )

                # Verify every migrated row before transaction commit.
                for item_id, _, _ in uploaded:
                    cur.execute(
                        "SELECT image_url FROM lost_items WHERE id = %s",
                        (item_id,),
                    )

                    value = cur.fetchone()[0]

                    if not (
                        isinstance(value, str)
                        and value.startswith(CLOUDINARY_PREFIX)
                    ):
                        raise RuntimeError(
                            f"Verification failed for Neon item ID {item_id}."
                        )
    finally:
        conn.close()

    # Final independent count check.
    conn = postgres_connection(database_url, db_username, db_password)
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT COUNT(*)
                FROM lost_items
                WHERE id = ANY(%s)
                  AND image_url LIKE %s
                """,
                (
                    [item_id for item_id, _, _ in uploaded],
                    CLOUDINARY_PREFIX + "%",
                ),
            )

            final_count = cur.fetchone()[0]
    finally:
        conn.close()

    if final_count != EXPECTED_COUNT:
        raise RuntimeError(
            f"Final verification failed: expected {EXPECTED_COUNT}, found {final_count}."
        )

    print("\n========================================")
    print("18 EXISTING IMAGES MIGRATED")
    print("========================================")
    print("Cloudinary:           18/18 ✅")
    print("Neon image_url:       18/18 ✅")
    print("Original item IDs:    preserved ✅")
    print("MySQL source changed: NO ✅")
    print("\nThe existing 18 images now have Cloudinary URLs in Neon.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("\nIMAGE MIGRATION FAILED")
        print(str(exc))
        sys.exit(1)
