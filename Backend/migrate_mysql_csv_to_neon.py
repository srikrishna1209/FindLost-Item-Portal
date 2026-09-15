import csv
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    import psycopg
except ImportError:
    print("Missing dependency: psycopg")
    print("Install it with: python -m pip install \"psycopg[binary]\"")
    sys.exit(1)

BASE_DIR = Path(__file__).resolve().parent

FILES = {
    "users": BASE_DIR / "users.csv",
    "lost_items": BASE_DIR / "lost_items.csv",
    "claim_requests": BASE_DIR / "claim_requests.csv",
    "contact_messages": BASE_DIR / "contact_messages.csv",
}

EXPECTED_COLUMNS = {
    "users": ["id", "email", "name", "password", "role"],
    "lost_items": ["id", "description", "item_name", "location", "status", "image_url", "user_id"],
    "claim_requests": ["id", "created_at", "message", "status", "item_id", "user_id"],
    "contact_messages": ["id", "created_at", "email", "message", "name", "status", "subject"],
}

TABLE_ORDER = [
    "users",
    "lost_items",
    "claim_requests",
    "contact_messages",
]

def read_csv(table):
    path = FILES[table]
    if not path.exists():
        raise FileNotFoundError(f"Missing file: {path}")

    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        columns = reader.fieldnames or []
        if columns != EXPECTED_COLUMNS[table]:
            raise ValueError(
                f"{table}.csv columns do not match.\n"
                f"Expected: {EXPECTED_COLUMNS[table]}\n"
                f"Found:    {columns}"
            )
        rows = list(reader)
        return rows

def parse_timestamp(value):
    if value is None or value == "":
        return None
    return datetime.fromisoformat(value)

def clean_value(table, column, value):
    if value == "":
        # Only nullable CSV fields are converted to SQL NULL.
        if (table, column) in {
            ("users", "email"),
            ("lost_items", "image_url"),
            ("lost_items", "user_id"),
            ("claim_requests", "created_at"),
            ("claim_requests", "message"),
            ("claim_requests", "status"),
            ("claim_requests", "item_id"),
            ("claim_requests", "user_id"),
            ("contact_messages", "subject"),
        }:
            return None

    if column == "id" or column in {"user_id", "item_id"}:
        return int(value)

    if column == "created_at":
        return parse_timestamp(value)

    return value

def main():
    database_url = os.getenv("NEON_DB_URL")
    username = os.getenv("NEON_DB_USERNAME")
    password = os.getenv("NEON_DB_PASSWORD")

    missing = []
    if not database_url:
        missing.append("NEON_DB_URL")
    if not username:
        missing.append("NEON_DB_USERNAME")
    if not password:
        missing.append("NEON_DB_PASSWORD")

    if missing:
        print("Missing environment variable(s): " + ", ".join(missing))
        print("Set them in this same PowerShell session and run the script again.")
        sys.exit(1)

    print("Reading CSV files...")
    data = {table: read_csv(table) for table in TABLE_ORDER}

    for table in TABLE_ORDER:
        print(f"  {table}: {len(data[table])} rows")

    expected_counts = {
        "users": 7,
        "lost_items": 18,
        "claim_requests": 10,
        "contact_messages": 1,
    }

    actual_counts = {table: len(data[table]) for table in TABLE_ORDER}
    if actual_counts != expected_counts:
        raise ValueError(
            f"CSV counts do not match the verified MySQL baseline.\n"
            f"Expected: {expected_counts}\n"
            f"Found:    {actual_counts}"
        )

    print("\nConnecting to Neon...")
    # Spring Boot uses a JDBC URL (jdbc:postgresql://...),
    # while psycopg expects a normal PostgreSQL/libpq URI (postgresql://...).
    psycopg_url = database_url
    if psycopg_url.startswith("jdbc:postgresql://"):
        psycopg_url = psycopg_url[len("jdbc:"):]

    with psycopg.connect(psycopg_url, user=username, password=password) as conn:
        with conn.cursor() as cur:
            # Safety check: do not overwrite an existing Neon database.
            cur.execute("""
                SELECT
                    (SELECT COUNT(*) FROM users),
                    (SELECT COUNT(*) FROM lost_items),
                    (SELECT COUNT(*) FROM claim_requests),
                    (SELECT COUNT(*) FROM contact_messages)
            """)
            counts = cur.fetchone()

            if counts != (0, 0, 0, 0):
                raise RuntimeError(
                    "SAFETY STOP: Neon is not empty.\n"
                    f"Current counts: users={counts[0]}, lost_items={counts[1]}, "
                    f"claim_requests={counts[2]}, contact_messages={counts[3]}\n"
                    "Nothing was changed."
                )

            print("Neon is empty. Starting migration...")

            # 1. users
            cur.executemany(
                """
                INSERT INTO users (id, email, name, password, role)
                VALUES (%s, %s, %s, %s, %s)
                """,
                [
                    tuple(
                        clean_value("users", col, row[col])
                        for col in EXPECTED_COLUMNS["users"]
                    )
                    for row in data["users"]
                ],
            )
            print("  ✓ users inserted")

            # 2. lost_items
            cur.executemany(
                """
                INSERT INTO lost_items
                    (id, description, item_name, location, status, image_url, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                [
                    tuple(
                        clean_value("lost_items", col, row[col])
                        for col in EXPECTED_COLUMNS["lost_items"]
                    )
                    for row in data["lost_items"]
                ],
            )
            print("  ✓ lost_items inserted")

            # 3. claim_requests
            cur.executemany(
                """
                INSERT INTO claim_requests
                    (id, created_at, message, status, item_id, user_id)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                [
                    tuple(
                        clean_value("claim_requests", col, row[col])
                        for col in EXPECTED_COLUMNS["claim_requests"]
                    )
                    for row in data["claim_requests"]
                ],
            )
            print("  ✓ claim_requests inserted")

            # 4. contact_messages
            cur.executemany(
                """
                INSERT INTO contact_messages
                    (id, created_at, email, message, name, status, subject)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                [
                    tuple(
                        clean_value("contact_messages", col, row[col])
                        for col in EXPECTED_COLUMNS["contact_messages"]
                    )
                    for row in data["contact_messages"]
                ],
            )
            print("  ✓ contact_messages inserted")

            # Reset identity sequences so the next generated IDs continue
            # after the highest migrated IDs.
            cur.execute("""
                SELECT setval(
                    pg_get_serial_sequence('users', 'id'),
                    COALESCE((SELECT MAX(id) FROM users), 1),
                    true
                );
            """)
            cur.execute("""
                SELECT setval(
                    pg_get_serial_sequence('lost_items', 'id'),
                    COALESCE((SELECT MAX(id) FROM lost_items), 1),
                    true
                );
            """)
            cur.execute("""
                SELECT setval(
                    pg_get_serial_sequence('claim_requests', 'id'),
                    COALESCE((SELECT MAX(id) FROM claim_requests), 1),
                    true
                );
            """)
            cur.execute("""
                SELECT setval(
                    pg_get_serial_sequence('contact_messages', 'id'),
                    COALESCE((SELECT MAX(id) FROM contact_messages), 1),
                    true
                );
            """)

            # Verify counts before committing.
            cur.execute("""
                SELECT
                    (SELECT COUNT(*) FROM users),
                    (SELECT COUNT(*) FROM lost_items),
                    (SELECT COUNT(*) FROM claim_requests),
                    (SELECT COUNT(*) FROM contact_messages)
            """)
            final_counts = cur.fetchone()

            expected_tuple = (
                expected_counts["users"],
                expected_counts["lost_items"],
                expected_counts["claim_requests"],
                expected_counts["contact_messages"],
            )

            if final_counts != expected_tuple:
                raise RuntimeError(
                    "Verification failed. Transaction will be rolled back.\n"
                    f"Expected: {expected_tuple}\n"
                    f"Found:    {final_counts}"
                )

            conn.commit()

    print("\n========================================")
    print("MIGRATION SUCCESSFUL")
    print("========================================")
    print(f"users:              {expected_counts['users']}")
    print(f"lost_items:         {expected_counts['lost_items']}")
    print(f"claim_requests:     {expected_counts['claim_requests']}")
    print(f"contact_messages:   {expected_counts['contact_messages']}")
    print("\nAll original IDs and image_url values were preserved.")
    print("The MySQL database was not modified by this script.")

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("\nMIGRATION FAILED")
        print(str(exc))
        sys.exit(1)
