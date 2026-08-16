import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminItems.css";

function AdminItems() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadItems();
  }, []);


  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/items");

      setItems(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Loading admin items failed:",
        err
      );

      if (err.response?.status === 401) {
        setError("Please log in again.");
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to access admin items."
        );
      } else {
        setError(
          "Unable to load reported items right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const counts = useMemo(() => {
    return {
      all: items.length,

      lost: items.filter(
        (item) =>
          item.status?.toUpperCase() === "LOST"
      ).length,

      found: items.filter(
        (item) =>
          item.status?.toUpperCase() === "FOUND"
      ).length,

      claimed: items.filter(
        (item) =>
          item.status?.toUpperCase() === "CLAIMED"
      ).length,
    };
  }, [items]);


  const filteredItems = useMemo(() => {
    const text = searchText
      .trim()
      .toLowerCase();


    return items.filter((item) => {

      const status =
        item.status?.toUpperCase() || "";


      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : status === statusFilter;


      const matchesSearch =
        !text ||
        item.itemName
          ?.toLowerCase()
          .includes(text) ||
        item.description
          ?.toLowerCase()
          .includes(text) ||
        item.location
          ?.toLowerCase()
          .includes(text) ||
        item.userName
          ?.toLowerCase()
          .includes(text) ||
        item.userEmail
          ?.toLowerCase()
          .includes(text);


      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [items, searchText, statusFilter]);


  const getStatusLabel = (status) => {
    const normalized =
      status?.toUpperCase() || "UNKNOWN";

    return normalized;
  };


  const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return null;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads/")) {
    return `http://localhost:8080${imageUrl}`;
  }

  return `http://localhost:8080/uploads/${imageUrl}`;
};


  if (loading) {
    return (
      <div className="admin-items-page admin-items-state-page">

        <div className="admin-items-state-card">

          <div className="admin-items-spinner"></div>

          <span>
            ADMIN · ITEM MANAGEMENT
          </span>

          <h2>
            Opening reported items...
          </h2>

          <p>
            We're bringing in the latest reports
            from the FindLost community.
          </p>

        </div>

      </div>
    );
  }


  if (error && items.length === 0) {
    return (
      <div className="admin-items-page admin-items-state-page">

        <div className="admin-items-state-card error">

          <div className="admin-items-error-icon">
            !
          </div>

          <span>
            ADMIN · ITEM MANAGEMENT
          </span>

          <h2>
            Items unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="admin-items-retry"
            onClick={loadItems}
          >
            Try again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="admin-items-page">

      <div className="admin-items-shape admin-items-shape-one"></div>

      <div className="admin-items-shape admin-items-shape-two"></div>

      <div className="admin-items-shape admin-items-shape-three"></div>


      <div className="admin-items-wrapper">

        {/* ==================================================
            HERO
            ================================================== */}

        <section className="admin-items-hero">

          <div className="admin-items-eyebrow">
            <span></span>
            ADMIN · ITEM MANAGEMENT
          </div>

          <h1>
            The reports shaping
            <br />
            <em>the FindLost community.</em>
          </h1>

          <p>
            Review the lost and found reports currently
            stored in the FindLost system.
          </p>

        </section>


        {/* ==================================================
            STATS
            ================================================== */}

        <section className="admin-items-stats">

          <button
            type="button"
            className={`admin-items-stat all ${
              statusFilter === "ALL"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("ALL")
            }
          >
            <span>
              ALL ITEMS
            </span>

            <strong>
              {counts.all}
            </strong>

            <small>
              All reports
            </small>
          </button>


          <button
            type="button"
            className={`admin-items-stat lost ${
              statusFilter === "LOST"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("LOST")
            }
          >
            <span>
              LOST
            </span>

            <strong>
              {counts.lost}
            </strong>

            <small>
              Looking for their owners
            </small>
          </button>


          <button
            type="button"
            className={`admin-items-stat found ${
              statusFilter === "FOUND"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("FOUND")
            }
          >
            <span>
              FOUND
            </span>

            <strong>
              {counts.found}
            </strong>

            <small>
              Ready to be claimed
            </small>
          </button>


          <button
            type="button"
            className={`admin-items-stat claimed ${
              statusFilter === "CLAIMED"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("CLAIMED")
            }
          >
            <span>
              CLAIMED
            </span>

            <strong>
              {counts.claimed}
            </strong>

            <small>
              Already reunited
            </small>
          </button>

        </section>


        {/* ==================================================
            SEARCH / FILTER
            ================================================== */}

        <section className="admin-items-toolbar">

          <div className="admin-items-toolbar-heading">

            <span>
              REPORTS
            </span>

            <h2>
              Reported items
            </h2>

          </div>


          <div className="admin-items-controls">

            <div className="admin-items-search">

              <span>
                ⌕
              </span>

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
                placeholder="Search item, location or reporter..."
              />

              {searchText && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchText("")
                  }
                >
                  ×
                </button>
              )}

            </div>


            <button
              type="button"
              className="admin-items-refresh"
              onClick={loadItems}
            >
              Refresh
              <span>↻</span>
            </button>

          </div>

        </section>


        {error && (
          <div className="admin-items-inline-error">
            {error}
          </div>
        )}


        {/* ==================================================
            RESULTS
            ================================================== */}

        <div className="admin-items-results-meta">

          <span>
            Showing
            <strong>
              {filteredItems.length}
            </strong>
            {filteredItems.length === 1
              ? " item"
              : " items"}
          </span>

          {(searchText ||
            statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setStatusFilter("ALL");
              }}
            >
              Clear filters
            </button>
          )}

        </div>


        {filteredItems.length === 0 ? (

          <div className="admin-items-empty">

            <div className="admin-items-empty-icon">
              ⌕
            </div>

            <span>
              NO MATCHES
            </span>

            <h3>
              No items match your search.
            </h3>

            <p>
              Try another keyword or clear the filters
              to browse all reports.
            </p>

          </div>

        ) : (

          <div className="admin-items-grid">

            {filteredItems.map((item) => {

              const status =
                getStatusLabel(item.status);

              const imageUrl =
                getImageUrl(item.imageUrl);


              return (
                <article
                  key={item.id}
                  className={`admin-item-card ${status.toLowerCase()}`}
                >

                  {/* ------------------------------------------
                      IMAGE
                      ------------------------------------------ */}

                  <div className="admin-item-image">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={item.itemName}
                      />

                    ) : (

                      <div className="admin-item-placeholder">

                        <span>
                          {item.itemName
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "?"}
                        </span>

                      </div>

                    )}


                    <span
                      className={`admin-item-badge ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>

                  </div>


                  {/* ------------------------------------------
                      CONTENT
                      ------------------------------------------ */}

                  <div className="admin-item-content">

                    <div className="admin-item-category">
                      ITEM #{item.id}
                    </div>


                    <h3>
                      {item.itemName}
                    </h3>


                    {item.description && (
                      <p className="admin-item-description">
                        {item.description}
                      </p>
                    )}


                    <div className="admin-item-location">
                      <span>
                        ◉
                      </span>

                      <span>
                        {item.location ||
                          "Location unavailable"}
                      </span>
                    </div>


                    <div className="admin-item-reporter">

                      <div className="admin-item-reporter-avatar">
                        {item.userName
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "?"}
                      </div>

                      <div>

                        <span>
                          REPORTED BY
                        </span>

                        <strong>
                          {item.userName ||
                            "Unknown reporter"}
                        </strong>

                      </div>

                    </div>


                    <div className="admin-item-footer">

                      <span>
                        {item.userEmail ||
                          "No email available"}
                      </span>


                      <Link
                        to={`/items/${item.id}`}
                        className="admin-item-view"
                      >
                        View item
                        <b>→</b>
                      </Link>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}


        {/* ==================================================
            FOOTER
            ================================================== */}

        <section className="admin-items-footer-note">

          <span>
            FINDLOST ADMIN
          </span>

          <p>
            Every report is another opportunity to help
            something lost find its way home.
          </p>

        </section>

      </div>

    </div>
  );
}

export default AdminItems;