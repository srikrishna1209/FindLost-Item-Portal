import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminClaims.css";

function AdminClaims() {
  const [claims, setClaims] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/admin/claims");

      setClaims(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Loading admin claims failed:",
        err
      );

      if (err.response?.status === 401) {
        setError("Please log in again.");
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to access admin claims."
        );
      } else {
        setError(
          "Unable to load claim requests right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadClaims();
  }, []);


  const counts = useMemo(() => {
    return {
      total: claims.length,

      pending: claims.filter(
        (claim) =>
          claim.status?.toUpperCase() === "PENDING"
      ).length,

      approved: claims.filter(
        (claim) =>
          claim.status?.toUpperCase() === "APPROVED"
      ).length,

      rejected: claims.filter(
        (claim) =>
          claim.status?.toUpperCase() === "REJECTED"
      ).length,
    };
  }, [claims]);


  const updateClaim = async (claimId, action) => {
    try {
      setUpdatingId(claimId);
      setError("");

      const endpoint =
        action === "approve"
          ? `/api/admin/claims/${claimId}/approve`
          : `/api/admin/claims/${claimId}/reject`;

      const response = await api.put(endpoint);

      setClaims((previous) =>
        previous.map((claim) =>
          claim.id === claimId
            ? response.data
            : claim
        )
      );
    } catch (err) {
      console.error(
        "Updating admin claim failed:",
        err
      );

      if (err.response?.status === 403) {
        setError(
          "You are not allowed to update this claim."
        );
      } else if (err.response?.status === 404) {
        setError(
          "That claim could not be found."
        );
      } else {
        setError(
          "Unable to update this claim right now."
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };


  const formatDate = (value) => {
    if (!value) {
      return "Date unavailable";
    }

    try {
      return new Date(value).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return value;
    }
  };


  const normalizeStatus = (status) =>
    status?.toUpperCase() || "PENDING";


  if (loading) {
    return (
      <div className="admin-claims-page admin-claims-state-page">

        <div className="admin-claims-state-card">

          <div className="admin-claims-spinner"></div>

          <span>
            ADMIN · CLAIMS
          </span>

          <h2>
            Opening claim requests...
          </h2>

          <p>
            We're bringing in the latest requests
            from the FindLost community.
          </p>

        </div>

      </div>
    );
  }


  if (error && claims.length === 0) {
    return (
      <div className="admin-claims-page admin-claims-state-page">

        <div className="admin-claims-state-card error">

          <div className="admin-claims-error-icon">
            !
          </div>

          <span>
            ADMIN · CLAIMS
          </span>

          <h2>
            Claims unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="admin-claims-retry"
            onClick={loadClaims}
          >
            Try again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="admin-claims-page">

      <div className="admin-claims-shape admin-claims-shape-one"></div>

      <div className="admin-claims-shape admin-claims-shape-two"></div>

      <div className="admin-claims-shape admin-claims-shape-three"></div>


      <div className="admin-claims-wrapper">

        {/* ==================================================
            HERO
            ================================================== */}

        <section className="admin-claims-hero">

          <div className="admin-claims-eyebrow">
            <span></span>
            ADMIN · CLAIM REQUESTS
          </div>

          <h1>
            Help the right
            <br />
            <em>items find their owners.</em>
          </h1>

          <p>
            Review community claim requests and keep
            the return process moving in the right direction.
          </p>

        </section>


        {/* ==================================================
            STATS
            ================================================== */}

        <section className="admin-claims-stats">

          <div className="admin-claims-stat total">
            <span>
              TOTAL CLAIMS
            </span>

            <strong>
              {counts.total}
            </strong>

            <small>
              All claim requests
            </small>
          </div>


          <div className="admin-claims-stat pending">
            <span>
              PENDING
            </span>

            <strong>
              {counts.pending}
            </strong>

            <small>
              Waiting for a decision
            </small>
          </div>


          <div className="admin-claims-stat approved">
            <span>
              APPROVED
            </span>

            <strong>
              {counts.approved}
            </strong>

            <small>
              Successfully approved
            </small>
          </div>


          <div className="admin-claims-stat rejected">
            <span>
              REJECTED
            </span>

            <strong>
              {counts.rejected}
            </strong>

            <small>
              Requests declined
            </small>
          </div>

        </section>


        {/* ==================================================
            LIST HEADER
            ================================================== */}

        <section className="admin-claims-list-header">

          <div>

            <span>
              REVIEW QUEUE
            </span>

            <h2>
              Claim requests
            </h2>

          </div>


          <button
            type="button"
            className="admin-claims-refresh"
            onClick={loadClaims}
          >
            Refresh claims
            <span>↻</span>
          </button>

        </section>


        {error && claims.length > 0 && (
          <div className="admin-claims-inline-error">
            {error}
          </div>
        )}


        {/* ==================================================
            CLAIM LIST
            ================================================== */}

        {claims.length === 0 ? (

          <div className="admin-claims-empty">

            <div className="admin-claims-empty-icon">
              ✓
            </div>

            <span>
              NOTHING TO REVIEW
            </span>

            <h3>
              No claim requests yet.
            </h3>

            <p>
              New claims submitted by community members
              will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-claims-list">

            {claims.map((claim) => {

              const status =
                normalizeStatus(claim.status);

              const isPending =
                status === "PENDING";

              const isUpdating =
                updatingId === claim.id;


              return (
                <article
                  key={claim.id}
                  className={`admin-claim-card ${status.toLowerCase()}`}
                >

                  {/* ------------------------------------------
                      TOP
                      ------------------------------------------ */}

                  <div className="admin-claim-top">

                    <div className="admin-claim-number">
                      CLAIM #{claim.id}
                    </div>

                    <span
                      className={`admin-claim-status ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>

                  </div>


                  {/* ------------------------------------------
                      MAIN
                      ------------------------------------------ */}

                  <div className="admin-claim-main">

                    <div className="admin-claim-person">

                      <div className="admin-claim-avatar">
                        {claim.userName
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </div>


                      <div>

                        <span>
                          CLAIMANT
                        </span>

                        <h3>
                          {claim.userName ||
                            "Unknown user"}
                        </h3>

                        <a
                          href={`mailto:${claim.userEmail}`}
                        >
                          {claim.userEmail}
                        </a>

                      </div>

                    </div>


                    <div className="admin-claim-item">

                      <span>
                        CLAIMED ITEM
                      </span>

                      <h3>
                        {claim.itemName ||
                          "Unknown item"}
                      </h3>

                      <Link
                        to={`/items/${claim.itemId}`}
                      >
                        View item
                        <b>→</b>
                      </Link>

                    </div>

                  </div>


                  {/* ------------------------------------------
                      MESSAGE
                      ------------------------------------------ */}

                  <div className="admin-claim-message">

                    <span>
                      CLAIM MESSAGE
                    </span>

                    <p>
                      {claim.message ||
                        "No message was provided."}
                    </p>

                  </div>


                  {/* ------------------------------------------
                      FOOTER
                      ------------------------------------------ */}

                  <div className="admin-claim-footer">

                    <time>
                      Submitted {formatDate(
                        claim.createdAt
                      )}
                    </time>


                    {isPending ? (

                      <div className="admin-claim-actions">

                        <button
                          type="button"
                          className="admin-claim-reject"
                          disabled={isUpdating}
                          onClick={() =>
                            updateClaim(
                              claim.id,
                              "reject"
                            )
                          }
                        >
                          {isUpdating
                            ? "Updating..."
                            : "Reject"}
                        </button>


                        <button
                          type="button"
                          className="admin-claim-approve"
                          disabled={isUpdating}
                          onClick={() =>
                            updateClaim(
                              claim.id,
                              "approve"
                            )
                          }
                        >
                          {isUpdating
                            ? "Updating..."
                            : "Approve"}
                        </button>

                      </div>

                    ) : (

                      <div className="admin-claim-final-state">
                        {status === "APPROVED"
                          ? "Claim approved"
                          : "Claim rejected"}
                      </div>

                    )}

                  </div>

                </article>
              );
            })}

          </div>
        )}


        {/* ==================================================
            FOOTER
            ================================================== */}

        <section className="admin-claims-footer-note">

          <span>
            FINDLOST ADMIN
          </span>

          <p>
            Every careful decision helps a lost belonging
            move one step closer to the person who is looking for it.
          </p>

        </section>

      </div>

    </div>
  );
}

export default AdminClaims;