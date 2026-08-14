import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./MyItems.css";

function MyItems() {
  const [items, setItems] = useState([]);
  const [claimsByItem, setClaimsByItem] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewingClaim, setReviewingClaim] =
    useState(null);

  const [reviewLoading, setReviewLoading] =
    useState(false);

  const [reviewError, setReviewError] =
    useState("");


  useEffect(() => {
    loadMyItems();
  }, []);


  const loadMyItems = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/api/items/my-items");

      const myItems =
        Array.isArray(response.data)
          ? response.data
          : [];

      setItems(myItems);


      const foundItems =
        myItems.filter(
          (item) =>
            item.status?.toUpperCase() === "FOUND"
        );


      const claimResults =
        await Promise.all(
          foundItems.map(async (item) => {

            try {

              const result =
                await api.get(
                  `/api/claims/item/${item.id}`
                );

              return {
                itemId: item.id,
                claims:
                  Array.isArray(result.data)
                    ? result.data
                    : [],
              };

            } catch (claimError) {

              console.error(
                `Loading claims for item ${item.id} failed:`,
                claimError
              );

              return {
                itemId: item.id,
                claims: [],
              };
            }
          })
        );


      const claimMap = {};

      claimResults.forEach(
        ({ itemId, claims }) => {
          claimMap[itemId] = claims;
        }
      );

      setClaimsByItem(claimMap);

    } catch (err) {

      console.error(
        "Loading my items failed:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Please log in to view your reported items."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You don't have permission to view your reported items."
        );
      } else {
        setError(
          "Unable to load your reported items."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  const handleReview = async (
    claimId,
    status
  ) => {

    try {

      setReviewLoading(true);
      setReviewError("");

      await api.put(
        `/api/claims/${claimId}/status`,
        null,
        {
          params: {
            status,
          },
        }
      );


      setReviewingClaim(null);

      await loadMyItems();

    } catch (err) {

      console.error(
        "Updating claim failed:",
        err
      );

      if (err.response?.data?.message) {
        setReviewError(
          err.response.data.message
        );
      } else if (err.response?.status === 403) {
        setReviewError(
          "You are not allowed to review this claim."
        );
      } else {
        setReviewError(
          "Unable to update the claim right now."
        );
      }

    } finally {
      setReviewLoading(false);
    }
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
      <div className="my-items-page my-items-state">

        <div className="my-items-state-card">

          <div className="my-items-spinner"></div>

          <h2>
            Loading your reports...
          </h2>

          <p>
            We're bringing together the items
            you've reported.
          </p>

        </div>

      </div>
    );
  }


  if (error) {
    return (
      <div className="my-items-page my-items-state">

        <div className="my-items-state-card error">

          <div className="my-items-state-icon">
            !
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={loadMyItems}
            className="my-items-retry"
          >
            Try again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="my-items-page">

      <div className="my-items-bg my-items-bg-one"></div>
      <div className="my-items-bg my-items-bg-two"></div>


      <div className="my-items-wrapper">

        {/* ===================================================
            HEADER
            =================================================== */}

        <section className="my-items-header">

          <div className="my-items-eyebrow">
            <span></span>
            MY REPORTED ITEMS
          </div>

          <h1>
            The items
            <br />
            <span>you've helped bring forward.</span>
          </h1>

          <p>
            Manage the items you've reported and review
            claims from people who believe a found item
            belongs to them.
          </p>

        </section>


        {/* ===================================================
            COUNT
            =================================================== */}

        <div className="my-items-count">

          <strong>
            {items.length}
          </strong>

          <span>
            {items.length === 1
              ? "reported item"
              : "reported items"}
          </span>

        </div>


        {/* ===================================================
            EMPTY
            =================================================== */}

        {items.length === 0 ? (

          <div className="my-items-empty">

            <div className="my-items-empty-icon">
              ♢
            </div>

            <span>
              NOTHING REPORTED YET
            </span>

            <h2>
              Your reported items will appear here.
            </h2>

            <p>
              When you report a lost or found item,
              you'll be able to keep track of it here.
            </p>

            <Link
              to="/report-found"
              className="my-items-empty-button"
            >
              Report a found item →
            </Link>

          </div>

        ) : (

          <div className="my-items-grid">

            {items.map((item) => {

              const isFound =
                item.status?.toUpperCase() === "FOUND";

              const itemClaims =
                claimsByItem[item.id] || [];

              const pendingClaims =
                itemClaims.filter(
                  (claim) =>
                    claim.status?.toUpperCase() ===
                    "PENDING"
                );

              const imageUrl =
                getImageUrl(item.imageUrl);


              return (
                <article
                  key={item.id}
                  className="my-item-card"
                >

                  {/* IMAGE */}

                  <div className="my-item-image">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={item.itemName}
                      />

                    ) : (

                      <div className="my-item-no-image">

                        <span>
                          {item.itemName
                            ?.charAt(0)
                            ?.toUpperCase() || "I"}
                        </span>

                      </div>

                    )}


                    <span
                      className={
                        isFound
                          ? "my-item-status found"
                          : "my-item-status lost"
                      }
                    >
                      {isFound
                        ? "FOUND"
                        : "LOST"}
                    </span>

                  </div>


                  {/* CONTENT */}

                  <div className="my-item-content">

                    <span className="my-item-label">
                      YOUR REPORT
                    </span>

                    <h2>
                      {item.itemName}
                    </h2>

                    <p>
                      {item.description}
                    </p>


                    <div className="my-item-location">
                      ⌖ {item.location}
                    </div>


                    {/* CLAIM INFORMATION */}

                    {isFound && (

                      <div className="my-item-claim-area">

                        <div className="my-item-claim-summary">

                          <div>

                            <span>
                              CLAIM REQUESTS
                            </span>

                            <strong>
                              {itemClaims.length}
                            </strong>

                          </div>


                          {pendingClaims.length >
                            0 && (

                            <div className="my-item-pending">

                              {pendingClaims.length}

                              {" pending"}

                            </div>

                          )}

                        </div>


                        {pendingClaims.length >
                          0 ? (

                          <div className="my-item-claim-list">

                            {pendingClaims.map(
                              (claim) => (

                                <div
                                  key={claim.id}
                                  className="my-item-claim"
                                >

                                  <div>

                                    <span>
                                      CLAIM #{claim.id}
                                    </span>

                                    <p>
                                      {claim.message}
                                    </p>

                                  </div>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      setReviewingClaim(
                                        claim
                                      )
                                    }
                                    className="my-item-review-button"
                                  >
                                    Review
                                  </button>

                                </div>
                              )
                            )}

                          </div>

                        ) : (

                          <div className="my-item-no-pending">
                            No pending claims.
                          </div>

                        )}

                      </div>

                    )}


                    <Link
                      to={`/items/${item.id}`}
                      className="my-item-view"
                    >
                      View item →
                    </Link>

                  </div>

                </article>
              );
            })}

          </div>

        )}


        {/* ===================================================
            REVIEW MODAL
            =================================================== */}

        {reviewingClaim && (

          <div
            className="claim-review-overlay"
            onClick={() => {
              if (!reviewLoading) {
                setReviewingClaim(null);
              }
            }}
          >

            <div
              className="claim-review-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="claim-review-top">

                <div>

                  <span>
                    CLAIM REQUEST
                  </span>

                  <h2>
                    Review this claim
                  </h2>

                </div>

                <button
                  type="button"
                  className="claim-review-close"
                  onClick={() =>
                    !reviewLoading &&
                    setReviewingClaim(null)
                  }
                >
                  ×
                </button>

              </div>


              <div className="claim-review-message">

                <small>
                  CLAIM MESSAGE
                </small>

                <p>
                  {reviewingClaim.message ||
                    "No message was provided."}
                </p>

              </div>


              <div className="claim-review-warning">

                <span>
                  ✦
                </span>

                <p>
                  Only approve this request when the
                  claimant has provided enough information
                  to verify that the item belongs to them.
                </p>

              </div>


              {reviewError && (

                <div className="claim-review-error">
                  {reviewError}
                </div>

              )}


              <div className="claim-review-actions">

                <button
                  type="button"
                  className="claim-review-reject"
                  disabled={reviewLoading}
                  onClick={() =>
                    handleReview(
                      reviewingClaim.id,
                      "REJECTED"
                    )
                  }
                >
                  {reviewLoading
                    ? "Updating..."
                    : "Reject claim"}
                </button>


                <button
                  type="button"
                  className="claim-review-approve"
                  disabled={reviewLoading}
                  onClick={() =>
                    handleReview(
                      reviewingClaim.id,
                      "APPROVED"
                    )
                  }
                >
                  {reviewLoading
                    ? "Updating..."
                    : "Approve claim"}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default MyItems;