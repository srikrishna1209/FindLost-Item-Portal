import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./ItemDetails.css";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // CLAIM STATE
  // =========================

  const [claimOpen, setClaimOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimSuccess, setClaimSuccess] = useState(false);


  useEffect(() => {
    loadItem();
  }, [id]);


  const loadItem = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/api/items/${id}`);

      setItem(response.data);

    } catch (err) {
      console.error("Loading item details failed:", err);

      if (err.response?.status === 404) {
        setError("This item could not be found.");
      } else if (err.response?.status === 401) {
        setError("Please log in to view this item.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view this item.");
      } else {
        setError("Unable to load this item right now.");
      }

    } finally {
      setLoading(false);
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


  const getStatus = () => {
    return item?.status?.toUpperCase() === "FOUND"
      ? "FOUND"
      : "LOST";
  };


  const isFound = getStatus() === "FOUND";


  const handleBack = () => {
    navigate(
      isFound
        ? "/found-items"
        : "/lost-items"
    );
  };


  // =========================================================
  // OPEN CLAIM FORM
  // =========================================================

  const openClaimForm = () => {
    setClaimError("");
    setClaimSuccess(false);
    setClaimOpen(true);

    setTimeout(() => {
      const claimBox =
        document.getElementById("claim-form");

      if (claimBox) {
        claimBox.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 50);
  };


  // =========================================================
  // CLOSE CLAIM FORM
  // =========================================================

  const closeClaimForm = () => {
    if (claimSubmitting) {
      return;
    }

    setClaimOpen(false);
    setClaimError("");
  };


  // =========================================================
  // SUBMIT CLAIM
  // =========================================================

  const handleClaimSubmit = async (event) => {
    event.preventDefault();

    setClaimError("");
    setClaimSuccess(false);

    const message = claimMessage.trim();

    if (!message) {
      setClaimError(
        "Please explain why you believe this item belongs to you."
      );
      return;
    }

    if (message.length < 10) {
      setClaimError(
        "Please provide a little more detail so the reporter can verify your claim."
      );
      return;
    }

    try {
      setClaimSubmitting(true);

      await api.post("/api/claims", {
        itemId: Number(id),
        message: message,
      });

      setClaimSuccess(true);
      setClaimMessage("");

    } catch (err) {
      console.error("Submitting claim failed:", err);

      if (err.response?.status === 401) {
        setClaimError(
          "Please log in before submitting a claim."
        );
      } else if (err.response?.status === 403) {
        setClaimError(
          "You don't have permission to submit this claim."
        );
      } else if (err.response?.data?.message) {
        setClaimError(
          err.response.data.message
        );
      } else {
        setClaimError(
          "Unable to submit your claim right now. Please try again."
        );
      }

    } finally {
      setClaimSubmitting(false);
    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="item-details-page item-details-state-page">

        <div className="item-details-state">

          <div className="item-details-spinner"></div>

          <h2>
            Opening item details...
          </h2>

          <p>
            Give us a moment while we bring
            the item information.
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error || !item) {
    return (
      <div className="item-details-page item-details-state-page">

        <div className="item-details-error-card">

          <div className="item-details-error-icon">
            !
          </div>

          <span>
            ITEM DETAILS
          </span>

          <h2>
            {error || "Item not found"}
          </h2>

          <p>
            The item may have been removed or may
            no longer be available.
          </p>

          <button
            type="button"
            className="item-details-back-button"
            onClick={() => navigate(-1)}
          >
            ← Go back
          </button>

        </div>

      </div>
    );
  }


  const imageUrl = getImageUrl(item.imageUrl);
  const status = getStatus();


  return (
    <div className="item-details-page">

      {/* =====================================================
          DECORATIVE BACKGROUND
          ===================================================== */}

      <div className="item-details-bg-shape item-details-bg-one"></div>

      <div className="item-details-bg-shape item-details-bg-two"></div>

      <div className="item-details-bg-shape item-details-bg-three"></div>


      <div className="item-details-wrapper">

        {/* ===================================================
            TOP NAVIGATION
            =================================================== */}

        <div className="item-details-topbar">

          <button
            type="button"
            className="item-details-back-link"
            onClick={handleBack}
          >
            <span>←</span>

            Back to{" "}
            {isFound
              ? "Found Items"
              : "Lost Items"}
          </button>


          <span className="item-details-id">
            ITEM #{item.id}
          </span>

        </div>


        {/* ===================================================
            MAIN CONTENT
            =================================================== */}

        <main className="item-details-layout">

          {/* =================================================
              IMAGE SIDE
              ================================================= */}

          <section className="item-details-image-section">

            <div className="item-details-image-card">

              <div
                className={`item-details-status ${
                  isFound
                    ? "item-details-status-found"
                    : "item-details-status-lost"
                }`}
              >

                <span>
                  {isFound
                    ? "✓"
                    : "!"}
                </span>

                {status}

              </div>


              {imageUrl ? (

                <div className="item-details-photo-wrapper">

                  <img
                    src={imageUrl}
                    alt={item.itemName || "Item"}
                    className="item-details-photo"
                    onError={(event) => {

                      event.currentTarget.style.display =
                        "none";

                      const fallback =
                        event.currentTarget.parentElement.querySelector(
                          ".item-details-image-fallback"
                        );

                      if (fallback) {
                        fallback.classList.add(
                          "visible"
                        );
                      }
                    }}
                  />


                  <div className="item-details-image-fallback">

                    <div>
                      {item.itemName
                        ?.charAt(0)
                        ?.toUpperCase() || "I"}
                    </div>

                    <span>
                      Image unavailable
                    </span>

                  </div>

                </div>

              ) : (

                <div className="item-details-no-image">

                  <div className="item-details-no-image-circle">

                    {item.itemName
                      ?.charAt(0)
                      ?.toUpperCase() || "I"}

                  </div>

                  <strong>
                    No photo available
                  </strong>

                  <span>
                    The reporter did not add an image.
                  </span>

                </div>

              )}

            </div>


            <div className="item-details-photo-note">

              <div className="item-details-note-icon">
                {isFound
                  ? "✓"
                  : "•"}
              </div>

              <div>

                <strong>
                  {isFound
                    ? "Someone may be looking for this."
                    : "Someone may be helping find this."
                  }
                </strong>

                <span>
                  Every useful detail can make a difference.
                </span>

              </div>

            </div>

          </section>


          {/* =================================================
              INFORMATION SIDE
              ================================================= */}

          <section className="item-details-info">

            <div className="item-details-eyebrow">

              <span></span>

              {status} ITEM

            </div>


            <h1>
              {item.itemName || "Unnamed item"}
            </h1>


            <div className="item-details-intro-line"></div>


            {/* DESCRIPTION */}

            <div className="item-details-description">

              <span className="item-details-section-label">
                DESCRIPTION
              </span>

              <p>
                {item.description ||
                  "No description was provided for this item."}
              </p>

            </div>


            {/* LOCATION */}

            <div className="item-details-location-card">

              <div className="item-details-location-icon">
                ⌖
              </div>

              <div>

                <span>
                  {isFound
                    ? "FOUND LOCATION"
                    : "LAST SEEN LOCATION"}
                </span>

                <strong>
                  {item.location ||
                    "Location not specified"}
                </strong>

              </div>

            </div>


            {/* STATUS */}

            <div className="item-details-status-card">

              <div
                className={`item-details-status-symbol ${
                  isFound
                    ? "found"
                    : "lost"
                }`}
              >
                {isFound
                  ? "✓"
                  : "!"}
              </div>

              <div>

                <span>
                  CURRENT STATUS
                </span>

                <strong>
                  {isFound
                    ? "Found and reported"
                    : "Reported as lost"}
                </strong>

              </div>

            </div>


            {/* =================================================
                ACTIONS
                ================================================= */}

            <div className="item-details-actions">

              {isFound ? (

                <button
                  type="button"
                  className="item-details-primary-action"
                  onClick={openClaimForm}
                  disabled={
                    claimSubmitting ||
                    claimSuccess
                  }
                >

                  <span>
                    {claimSuccess
                      ? "Claim submitted"
                      : "Claim this item"}
                  </span>

                  <span>
                    {claimSuccess
                      ? "✓"
                      : "→"}
                  </span>

                </button>

              ) : (

                <Link
                  to="/found-items"
                  className="item-details-primary-action"
                >

                  <span>
                    Browse found items
                  </span>

                  <span>
                    →
                  </span>

                </Link>

              )}


              <button
                type="button"
                className="item-details-secondary-action"
                onClick={handleBack}
              >
                Continue browsing
              </button>

            </div>


            {/* =================================================
                CLAIM FORM
                ================================================= */}

            {isFound && claimOpen && (

              <div
                id="claim-form"
                style={{
                  marginTop: "20px",
                  padding: "22px",
                  borderRadius: "18px",
                  background:
                    "linear-gradient(145deg, #fffaf5 0%, #f3f8f3 100%)",
                  border:
                    "1px solid #e5ddd4",
                  boxShadow:
                    "0 18px 40px rgba(30, 44, 67, 0.08)",
                }}
              >

                {!claimSuccess ? (

                  <form onSubmit={handleClaimSubmit}>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "15px",
                        marginBottom: "13px",
                      }}
                    >

                      <div>

                        <div
                          style={{
                            color: "#d97859",
                            fontSize: "9px",
                            fontWeight: "800",
                            letterSpacing: "1.6px",
                            marginBottom: "5px",
                          }}
                        >
                          CLAIM REQUEST
                        </div>

                        <h3
                          style={{
                            margin: 0,
                            color: "#18233f",
                            fontFamily:
                              'Georgia, "Times New Roman", serif',
                            fontSize: "24px",
                            lineHeight: "1.1",
                          }}
                        >
                          Think this is yours?
                        </h3>

                      </div>


                      <button
                        type="button"
                        onClick={closeClaimForm}
                        disabled={claimSubmitting}
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "1px solid #e2dcd4",
                          borderRadius: "50%",
                          background: "#ffffff",
                          color: "#7f8999",
                          cursor: claimSubmitting
                            ? "not-allowed"
                            : "pointer",
                          fontSize: "16px",
                        }}
                      >
                        ×
                      </button>

                    </div>


                    <p
                      style={{
                        margin: "0 0 17px",
                        color: "#778397",
                        fontSize: "11px",
                        lineHeight: "1.6",
                      }}
                    >
                      Tell the person who reported this item
                      why you believe it belongs to you.
                    </p>


                    <textarea
                      value={claimMessage}
                      onChange={(event) => {
                        setClaimMessage(
                          event.target.value
                        );
                        setClaimError("");
                      }}
                      placeholder="For example: This is my black wallet. It has my initials inside and I lost it near the college library..."
                      rows="5"
                      disabled={claimSubmitting}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px 14px",
                        border:
                          "1px solid #dfe4ea",
                        borderRadius: "12px",
                        outline: "none",
                        resize: "vertical",
                        background: "#ffffff",
                        color: "#18233f",
                        fontFamily: "inherit",
                        fontSize: "12px",
                        lineHeight: "1.6",
                      }}
                      onFocus={(event) => {
                        event.currentTarget.style.borderColor =
                          "#d97859";

                        event.currentTarget.style.boxShadow =
                          "0 0 0 4px rgba(217, 120, 89, 0.08)";
                      }}
                      onBlur={(event) => {
                        event.currentTarget.style.borderColor =
                          "#dfe4ea";

                        event.currentTarget.style.boxShadow =
                          "none";
                      }}
                    />


                    {claimError && (

                      <div
                        style={{
                          marginTop: "12px",
                          padding: "11px 13px",
                          borderRadius: "10px",
                          background: "#fff0eb",
                          border:
                            "1px solid #efc7bd",
                          color: "#b85642",
                          fontSize: "11px",
                          lineHeight: "1.5",
                        }}
                      >
                        {claimError}
                      </div>

                    )}


                    <div
                      style={{
                        display: "flex",
                        gap: "9px",
                        marginTop: "14px",
                      }}
                    >

                      <button
                        type="button"
                        onClick={closeClaimForm}
                        disabled={claimSubmitting}
                        style={{
                          flex: 1,
                          minHeight: "45px",
                          border:
                            "1px solid #ddd7cf",
                          borderRadius: "11px",
                          background: "#ffffff",
                          color: "#59677e",
                          fontFamily: "inherit",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: claimSubmitting
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        Cancel
                      </button>


                      <button
                        type="submit"
                        disabled={claimSubmitting}
                        style={{
                          flex: 1.7,
                          minHeight: "45px",
                          border: "none",
                          borderRadius: "11px",
                          background: claimSubmitting
                            ? "#dca08f"
                            : "#d97859",
                          color: "#ffffff",
                          fontFamily: "inherit",
                          fontSize: "11px",
                          fontWeight: "800",
                          cursor: claimSubmitting
                            ? "not-allowed"
                            : "pointer",
                          boxShadow:
                            "0 9px 20px rgba(217, 120, 89, 0.18)",
                        }}
                      >
                        {claimSubmitting
                          ? "Submitting..."
                          : "Submit Claim →"}
                      </button>

                    </div>

                  </form>

                ) : (

                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px 5px 4px",
                    }}
                  >

                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        margin: "0 auto 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: "#e3f1e7",
                        color: "#5d9870",
                        fontSize: "23px",
                        fontWeight: "800",
                      }}
                    >
                      ✓
                    </div>


                    <div
                      style={{
                        color: "#d97859",
                        fontSize: "9px",
                        fontWeight: "800",
                        letterSpacing: "1.5px",
                        marginBottom: "6px",
                      }}
                    >
                      REQUEST SENT
                    </div>


                    <h3
                      style={{
                        margin: "0 0 7px",
                        color: "#18233f",
                        fontFamily:
                          'Georgia, "Times New Roman", serif',
                        fontSize: "25px",
                      }}
                    >
                      Claim submitted.
                    </h3>


                    <p
                      style={{
                        margin: "0 auto 17px",
                        maxWidth: "320px",
                        color: "#778397",
                        fontSize: "11px",
                        lineHeight: "1.6",
                      }}
                    >
                      Your claim is now pending review.
                      The person who reported the item can
                      review your request.
                    </p>


                    <button
                      type="button"
                      onClick={() => {
                        setClaimOpen(false);
                      }}
                      style={{
                        minHeight: "42px",
                        padding: "0 18px",
                        border:
                          "1px solid #ddd7cf",
                        borderRadius: "999px",
                        background: "#ffffff",
                        color: "#59677e",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Continue browsing
                    </button>

                  </div>

                )}

              </div>

            )}


            {/* =================================================
                CLAIM NOTE
                ================================================= */}

            {isFound && !claimOpen && !claimSuccess && (

              <div className="item-details-claim-note">

                <span>
                  ✦
                </span>

                <p>
                  Think this is yours? Submit a claim with
                  details that can help verify your ownership.
                </p>

              </div>

            )}

          </section>

        </main>


        {/* ===================================================
            BOTTOM INFORMATION
            =================================================== */}

        <section className="item-details-bottom">

          <div className="item-details-bottom-item">

            <span className="bottom-number">
              01
            </span>

            <div>

              <strong>
                Clear details matter
              </strong>

              <p>
                A specific description makes identification
                much easier.
              </p>

            </div>

          </div>


          <div className="item-details-bottom-item">

            <span className="bottom-number green">
              02
            </span>

            <div>

              <strong>
                Check the location
              </strong>

              <p>
                The reported location can help connect the
                right person with the right item.
              </p>

            </div>

          </div>


          <div className="item-details-bottom-item">

            <span className="bottom-number yellow">
              03
            </span>

            <div>

              <strong>
                Keep looking
              </strong>

              <p>
                New reports are added as people help each
                other every day.
              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default ItemDetails;