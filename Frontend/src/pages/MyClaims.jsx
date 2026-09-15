import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./MyClaims.css";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [handoverLoading, setHandoverLoading] = useState(null);
  const [handoverError, setHandoverError] = useState("");

  useEffect(() => {
    loadMyClaims();
  }, []);

  const loadMyClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const [claimsResponse, itemsResponse] =
        await Promise.all([
          api.get("/api/claims/my-claims"),
          api.get("/api/items"),
        ]);

      setClaims(
        Array.isArray(claimsResponse.data)
          ? claimsResponse.data
          : []
      );

      setItems(
        Array.isArray(itemsResponse.data)
          ? itemsResponse.data
          : []
      );

    } catch (err) {
      console.error("Loading my claims failed:", err);

      if (err.response?.status === 401) {
        setError("Please log in to view your claims.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view your claims.");
      } else {
        setError("Unable to load your claims right now.");
      }
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // COMPLETE HANDOVER
  // =========================================================

  const handleCompleteHandover = async (claimId) => {
    const confirmed = window.confirm(
      "Have you successfully received the item and completed the handover?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setHandoverLoading(claimId);
      setHandoverError("");

      await api.put(
        `/api/claims/${claimId}/handover-complete`
      );

      await loadMyClaims();

    } catch (err) {
      console.error(
        "Completing handover failed:",
        err
      );

      if (err.response?.data?.message) {
        setHandoverError(
          err.response.data.message
        );
      } else if (err.response?.status === 403) {
        setHandoverError(
          "You are not allowed to complete this handover."
        );
      } else {
        setHandoverError(
          "Unable to complete the handover right now."
        );
      }

    } finally {
      setHandoverLoading(null);
    }
  };


  const itemMap = useMemo(() => {
    const map = {};

    items.forEach((item) => {
      map[item.id] = item;
    });

    return map;
  }, [items]);


  const getStatusClass = (status) => {
    const value = status?.toUpperCase();

    if (value === "APPROVED") {
      return "my-claims-status-approved";
    }

    if (value === "HANDOVER_COMPLETED") {
      return "my-claims-status-completed";
    }

    if (value === "REJECTED") {
      return "my-claims-status-rejected";
    }

    return "my-claims-status-pending";
  };


  const getStatusText = (status) => {
    const value = status?.toUpperCase();

    if (value === "APPROVED") {
      return "Approved";
    }

    if (value === "HANDOVER_COMPLETED") {
      return "Returned";
    }

    if (value === "REJECTED") {
      return "Rejected";
    }

    return "Pending";
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


  const pendingCount = claims.filter(
    (claim) =>
      claim.status?.toUpperCase() === "PENDING"
  ).length;


  const approvedCount = claims.filter(
    (claim) =>
      claim.status?.toUpperCase() === "APPROVED"
  ).length;


  const rejectedCount = claims.filter(
    (claim) =>
      claim.status?.toUpperCase() === "REJECTED"
  ).length;


  const completedCount = claims.filter(
    (claim) =>
      claim.status?.toUpperCase() ===
      "HANDOVER_COMPLETED"
  ).length;


  if (loading) {
    return (
      <div className="my-claims-page my-claims-state-page">

        <div className="my-claims-loading-card">

          <div className="my-claims-spinner"></div>

          <h2>
            Loading your claims...
          </h2>

          <p>
            We're bringing your claim requests together.
          </p>

        </div>

      </div>
    );
  }


  if (error) {
    return (
      <div className="my-claims-page my-claims-state-page">

        <div className="my-claims-error-card">

          <div className="my-claims-error-icon">
            !
          </div>

          <span>
            MY CLAIMS
          </span>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={loadMyClaims}
            className="my-claims-retry-button"
          >
            Try again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="my-claims-page">

      {/* =====================================================
          BACKGROUND DECORATION
          ===================================================== */}

      <div className="my-claims-shape my-claims-shape-one"></div>
      <div className="my-claims-shape my-claims-shape-two"></div>
      <div className="my-claims-shape my-claims-shape-three"></div>


      <div className="my-claims-wrapper">

        {/* ===================================================
            HERO
            =================================================== */}

        <section className="my-claims-hero">

          <div className="my-claims-eyebrow">
            <span></span>
            MY CLAIMS
          </div>

          <h1>
            The things
            <br />
            <span>you're trying to bring home.</span>
          </h1>

          <p>
            Keep track of the items you've claimed and
            follow each request as it moves forward.
          </p>

        </section>


        {/* ===================================================
            SUMMARY
            =================================================== */}

        <section className="my-claims-summary">

          <div className="my-claims-summary-card">

            <div className="my-claims-summary-icon">
              ✦
            </div>

            <div>
              <span>Total claims</span>
              <strong>{claims.length}</strong>
            </div>

          </div>


          <div className="my-claims-summary-card pending">

            <div className="my-claims-summary-icon">
              •
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>

          </div>


          <div className="my-claims-summary-card approved">

            <div className="my-claims-summary-icon">
              ✓
            </div>

            <div>
              <span>Approved</span>
              <strong>{approvedCount}</strong>
            </div>

          </div>


          <div className="my-claims-summary-card rejected">

            <div className="my-claims-summary-icon">
              ×
            </div>

            <div>
              <span>Rejected</span>
              <strong>{rejectedCount}</strong>
            </div>

          </div>


          <div className="my-claims-summary-card completed">

            <div className="my-claims-summary-icon">
              ✓
            </div>

            <div>
              <span>Returned</span>
              <strong>{completedCount}</strong>
            </div>

          </div>

        </section>


        {/* ===================================================
            CLAIMS
            =================================================== */}

        <section className="my-claims-list-section">

          <div className="my-claims-section-heading">

            <div>

              <span>
                YOUR REQUESTS
              </span>

              <h2>
                Claim history
              </h2>

            </div>

            <div className="my-claims-heading-actions">

              <Link
                to="/found-items"
                className="my-claims-browse-link"
              >
                Browse found items →
              </Link>

              <Link
                to="/returned-items"
                className="my-claims-returned-link"
              >
                Returned items →
              </Link>

            </div>

          </div>


          {handoverError && (
            <div className="my-claim-handover-error">
              {handoverError}
            </div>
          )}


          {claims.length === 0 ? (

            <div className="my-claims-empty">

              <div className="my-claims-empty-icon">
                ♢
              </div>

              <span>
                NO CLAIMS YET
              </span>

              <h3>
                Nothing here just yet.
              </h3>

              <p>
                When you find an item that you believe
                belongs to you, submit a claim and it
                will appear here.
              </p>

              <Link
                to="/found-items"
                className="my-claims-empty-button"
              >
                Browse found items →
              </Link>

            </div>

          ) : (

            <div className="my-claims-list">

              {claims.map((claim) => {

                const item =
                  itemMap[claim.itemId];

                const imageUrl =
                  getImageUrl(
                    item?.imageUrl
                  );

                const status =
                  claim.status?.toUpperCase() ||
                  "PENDING";


                return (
                  <article
                    className="my-claim-card"
                    key={claim.id}
                  >

                    {/* IMAGE */}

                    <div className="my-claim-image">

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={
                            item?.itemName ||
                            "Claimed item"
                          }
                        />

                      ) : (

                        <div className="my-claim-no-image">

                          <span>
                            {item?.itemName
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </span>

                        </div>

                      )}

                      <div className="my-claim-number">
                        CLAIM #{claim.id}
                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="my-claim-content">

                      <div className="my-claim-topline">

                        <span className="my-claim-label">
                          CLAIMED ITEM
                        </span>

                        <span
                          className={`my-claims-status ${getStatusClass(
                            status
                          )}`}
                        >
                          {getStatusText(status)}
                        </span>

                      </div>


                      <h3>
                        {item?.itemName ||
                          `Item #${claim.itemId}`}
                      </h3>


                      <div className="my-claim-location">

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


                      <div className="my-claim-message">

                        <small>
                          YOUR MESSAGE
                        </small>

                        <p>
                          {claim.message ||
                            "No message was provided."}
                        </p>

                      </div>


                      {/* =================================================
                          APPROVED → HANDOVER
                          ================================================= */}

                      {status === "APPROVED" && (

                        <div className="my-claim-handover">

                          <div className="my-claim-handover-header">

                            <div className="my-claim-handover-icon">
                              ✓
                            </div>

                            <div>

                              <span>
                                CLAIM APPROVED
                              </span>

                              <h4>
                                Arrange the handover
                              </h4>

                            </div>

                          </div>


                          {claim.otherUserName ||
                          claim.otherUserEmail ? (

                            <div className="my-claim-contact-card">

                              <div className="my-claim-contact-details">

                                <span>
                                  REPORTER CONTACT
                                </span>

                                <strong>
                                  {claim.otherUserName ||
                                    "Reporter"}
                                </strong>

                                {claim.otherUserEmail && (

                                  <a
                                    href={`mailto:${claim.otherUserEmail}`}
                                  >
                                    {claim.otherUserEmail}
                                  </a>

                                )}

                              </div>


                              {claim.otherUserEmail && (

                                <a
                                  href={`mailto:${claim.otherUserEmail}?subject=FindLost%20claim%20%23${claim.id}`}
                                  className="my-claim-contact-button"
                                >
                                  Contact User
                                </a>

                              )}

                            </div>

                          ) : (

                            <div className="my-claim-contact-unavailable">
                              Contact details are not available yet.
                            </div>

                          )}


                          <p className="my-claim-handover-note">
                            Arrange a safe meeting place and verify the
                            item details before completing the handover.
                          </p>


                          {/* COMPLETE HANDOVER BUTTON */}

                          <div className="my-claim-complete-area">

                            <div className="my-claim-complete-text">

                              <span>
                                FINAL STEP
                              </span>

                              <strong>
                                Did the handover happen successfully?
                              </strong>

                              <p>
                                Use this only after you have
                                received the item.
                              </p>

                            </div>


                            <button
                              type="button"
                              className="my-claim-complete-button"
                              disabled={
                                handoverLoading === claim.id
                              }
                              onClick={() =>
                                handleCompleteHandover(
                                  claim.id
                                )
                              }
                            >
                              {handoverLoading === claim.id
                                ? "Completing..."
                                : "✓ Mark Handover Complete"}
                            </button>

                          </div>

                        </div>
                      )}


                      {/* =================================================
                          HANDOVER COMPLETED
                          ================================================= */}

                      {status === "HANDOVER_COMPLETED" && (

                        <div className="my-claim-completed-card">

                          <div className="my-claim-completed-icon">
                            ✓
                          </div>

                          <div>

                            <span>
                              HANDOVER COMPLETED
                            </span>

                            <h4>
                              Item successfully returned
                            </h4>

                            <p>
                              This claim has been completed and
                              recorded in your returned items.
                            </p>

                          </div>

                          <Link
                            to="/returned-items"
                            className="my-claim-view-returned"
                          >
                            View Returned Items →
                          </Link>

                        </div>

                      )}


                      {/* FOOTER */}

                      <div className="my-claim-footer">

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

        <div className="my-claims-footer-message">

          <span>✦</span>

          Every claim is another step toward bringing
          something home.

          <span>✦</span>

        </div>

      </div>

    </div>
  );
}

export default MyClaims;