import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./ReturnedItems.css";

function ReturnedItems() {
  const [completedClaims, setCompletedClaims] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReturnedItems();
  }, []);

  const loadReturnedItems = async () => {
    try {
      setLoading(true);
      setError("");

      const [completedResponse, itemsResponse] =
        await Promise.all([
          api.get("/api/claims/my-completed"),
          api.get("/api/items"),
        ]);

      setCompletedClaims(
        Array.isArray(completedResponse.data)
          ? completedResponse.data
          : []
      );

      setItems(
        Array.isArray(itemsResponse.data)
          ? itemsResponse.data
          : []
      );
    } catch (err) {
      console.error(
        "Loading returned items failed:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Please log in to view your returned items."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You don't have permission to view returned items."
        );
      } else {
        setError(
          "Unable to load your returned items right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // ITEM MAP
  // =========================================================

  const itemMap = useMemo(() => {
    const map = {};

    items.forEach((item) => {
      map[item.id] = item;
    });

    return map;
  }, [items]);


  // =========================================================
  // IMAGE URL
  // =========================================================

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


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="returned-items-page returned-items-state-page">

        <div className="returned-items-loading-card">

          <div className="returned-items-spinner"></div>

          <h2>
            Loading returned items...
          </h2>

          <p>
            We're bringing together your completed handovers.
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="returned-items-page returned-items-state-page">

        <div className="returned-items-error-card">

          <div className="returned-items-error-icon">
            !
          </div>

          <span>
            RETURNED ITEMS
          </span>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={loadReturnedItems}
            className="returned-items-retry-button"
          >
            Try again
          </button>

        </div>

      </div>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="returned-items-page">

      {/* =====================================================
          BACKGROUND DECORATION
          ===================================================== */}

      <div className="returned-items-shape returned-items-shape-one"></div>

      <div className="returned-items-shape returned-items-shape-two"></div>

      <div className="returned-items-shape returned-items-shape-three"></div>


      <div className="returned-items-wrapper">

        {/* ===================================================
            HERO
            =================================================== */}

        <section className="returned-items-hero">

          <div className="returned-items-eyebrow">
            <span></span>
            RETURNED ITEMS
          </div>

          <h1>
            The things
            <br />
            <span>that made it home.</span>
          </h1>

          <p>
            A record of the items you've successfully
            received or returned through FindLost.
          </p>

        </section>


        {/* ===================================================
            SUMMARY
            =================================================== */}

        <section className="returned-items-summary">

          <div className="returned-items-summary-card">

            <div className="returned-items-summary-icon">
              ✓
            </div>

            <div>
              <span>
                COMPLETED HANDOVERS
              </span>

              <strong>
                {completedClaims.length}
              </strong>
            </div>

          </div>


          <div className="returned-items-summary-note">

            <span>
              FINDLOST
            </span>

            <strong>
              Successfully returned
            </strong>

            <p>
              Every completed handover represents
              something important finding its way home.
            </p>

          </div>

        </section>


        {/* ===================================================
            SECTION HEADER
            =================================================== */}

        <section className="returned-items-list-section">

          <div className="returned-items-section-heading">

            <div>

              <span>
                COMPLETED HISTORY
              </span>

              <h2>
                Returned items
              </h2>

            </div>

            <Link
              to="/my-claims"
              className="returned-items-back-link"
            >
              ← Back to My Claims
            </Link>

          </div>


          {/* =================================================
              EMPTY STATE
              ================================================= */}

          {completedClaims.length === 0 ? (

            <div className="returned-items-empty">

              <div className="returned-items-empty-icon">
                ✓
              </div>

              <span>
                NO RETURNED ITEMS YET
              </span>

              <h3>
                Nothing has made it home yet.
              </h3>

              <p>
                When an approved claim is successfully
                handed over, it will appear here as part
                of your completed history.
              </p>

              <Link
                to="/my-claims"
                className="returned-items-empty-button"
              >
                View My Claims →
              </Link>

            </div>

          ) : (

            /* =================================================
               COMPLETED ITEMS
               ================================================= */

            <div className="returned-items-list">

              {completedClaims.map((claim) => {

                const item =
                  itemMap[claim.itemId];

                const imageUrl =
                  getImageUrl(
                    item?.imageUrl
                  );


                return (
                  <article
                    className="returned-item-card"
                    key={claim.id}
                  >

                    {/* IMAGE */}

                    <div className="returned-item-image">

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={
                            item?.itemName ||
                            "Returned item"
                          }
                        />

                      ) : (

                        <div className="returned-item-no-image">

                          <span>
                            {item?.itemName
                              ?.charAt(0)
                              ?.toUpperCase() || "✓"}
                          </span>

                        </div>

                      )}

                      <div className="returned-item-status">
                        ✓ RETURNED
                      </div>

                    </div>


                    {/* CONTENT */}

                    <div className="returned-item-content">

                      <div className="returned-item-topline">

                        <span className="returned-item-label">
                          COMPLETED HANDOVER
                        </span>

                        <span className="returned-item-claim">
                          CLAIM #{claim.id}
                        </span>

                      </div>


                      <h3>
                        {item?.itemName ||
                          `Item #${claim.itemId}`}
                      </h3>


                      <div className="returned-item-location">

                        <span>
                          ⌖
                        </span>

                        <div>

                          <small>
                            REPORTED LOCATION
                          </small>

                          <strong>
                            {item?.location ||
                              "Location not available"}
                          </strong>

                        </div>

                      </div>


                      <div className="returned-item-message">

                        <small>
                          CLAIM MESSAGE
                        </small>

                        <p>
                          {claim.message ||
                            "No message was provided."}
                        </p>

                      </div>


                      <div className="returned-item-success">

                        <div className="returned-item-success-icon">
                          ✓
                        </div>

                        <div>

                          <span>
                            HANDOVER COMPLETED
                          </span>

                          <strong>
                            Item successfully returned
                          </strong>

                          <p>
                            This successful handover has been
                            recorded in your FindLost history.
                          </p>

                        </div>

                      </div>


                      <div className="returned-item-footer">

                        <span>
                          Request #{claim.id}
                        </span>

                        <Link
                          to={`/items/${claim.itemId}`}
                        >
                          View item →
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>


        {/* ===================================================
            FOOTER MESSAGE
            =================================================== */}

        <div className="returned-items-footer-message">

          <span>✦</span>

          Every returned item is one more story completed.

          <span>✦</span>

        </div>

      </div>

    </div>
  );
}

export default ReturnedItems;