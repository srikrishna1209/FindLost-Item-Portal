import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    new: 0,
    read: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    loadDashboard();
  }, []);


  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/admin/contact-messages/stats"
      );

      setStats({
        new: Number(response.data?.new || 0),
        read: Number(response.data?.read || 0),
        resolved: Number(
          response.data?.resolved || 0
        ),
      });
    } catch (err) {
      console.error(
        "Loading admin dashboard failed:",
        err
      );

      if (err.response?.status === 403) {
        setError(
          "You do not have permission to access the admin area."
        );
      } else {
        setError(
          "Unable to load the dashboard right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const totalMessages =
    stats.new +
    stats.read +
    stats.resolved;


  return (
    <div className="admin-dashboard-page">

      <div className="admin-dashboard-shape admin-dashboard-shape-one"></div>

      <div className="admin-dashboard-shape admin-dashboard-shape-two"></div>

      <div className="admin-dashboard-shape admin-dashboard-shape-three"></div>


      <div className="admin-dashboard-wrapper">

        {/* ==================================================
            HERO
            ================================================== */}

        <section className="admin-dashboard-hero">

          <div className="admin-dashboard-eyebrow">
            <span></span>
            FINDLOST · ADMIN
          </div>

          <h1>
            Keep everything
            <br />
            <em>moving forward.</em>
          </h1>

          <p>
            Your central place to keep track of
            FindLost activity and manage the community
            experience.
          </p>

        </section>


        {/* ==================================================
            OVERVIEW
            ================================================== */}

        <section className="admin-dashboard-overview">

          <div className="admin-dashboard-section-label">
            CONTACT OVERVIEW
          </div>

          <div className="admin-dashboard-stats">

            <div className="admin-dashboard-stat new">

              <span>
                NEW MESSAGES
              </span>

              <strong>
                {loading ? "—" : stats.new}
              </strong>

              <small>
                Awaiting attention
              </small>

            </div>


            <div className="admin-dashboard-stat read">

              <span>
                READ
              </span>

              <strong>
                {loading ? "—" : stats.read}
              </strong>

              <small>
                Reviewed messages
              </small>

            </div>


            <div className="admin-dashboard-stat resolved">

              <span>
                RESOLVED
              </span>

              <strong>
                {loading ? "—" : stats.resolved}
              </strong>

              <small>
                Completed conversations
              </small>

            </div>


            <div className="admin-dashboard-stat total">

              <span>
                TOTAL MESSAGES
              </span>

              <strong>
                {loading ? "—" : totalMessages}
              </strong>

              <small>
                All contact messages
              </small>

            </div>

          </div>

        </section>


        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (

          <div className="admin-dashboard-error">

            <strong>
              Something went wrong
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={loadDashboard}
            >
              Try again
            </button>

          </div>

        )}


        {/* ==================================================
            QUICK ACTIONS
            ================================================== */}

        <section className="admin-dashboard-management">

          <div className="admin-dashboard-management-heading">

            <span>
              MANAGEMENT
            </span>

            <h2>
              What would you like to manage?
            </h2>

          </div>


          <div className="admin-dashboard-cards">

            <Link
              to="/admin/contact-messages"
              className="admin-dashboard-card contact"
            >

              <div className="admin-dashboard-card-icon">
                ✦
              </div>

              <span>
                ADMIN · 01
              </span>

              <h3>
                Contact messages
              </h3>

              <p>
                Review community questions, feedback
                and requests submitted through FindLost.
              </p>

              <strong>
                Open inbox
                <b>→</b>
              </strong>

            </Link>


            <Link
              to="/my-items"
              className="admin-dashboard-card reports"
            >

              <div className="admin-dashboard-card-icon">
                ◇
              </div>

              <span>
                ADMIN · 02
              </span>

              <h3>
                Reported items
              </h3>

              <p>
                Review the items reported through the
                existing FindLost reporting workflow.
              </p>

              <strong>
                View reported items
                <b>→</b>
              </strong>

            </Link>


            <Link
              to="/found-items"
              className="admin-dashboard-card found"
            >

              <div className="admin-dashboard-card-icon">
                ✓
              </div>

              <span>
                ADMIN · 03
              </span>

              <h3>
                Found items
              </h3>

              <p>
                Browse the found-item records currently
                available in the community.
              </p>

              <strong>
                Browse found items
                <b>→</b>
              </strong>

            </Link>

            <Link
              to="/admin/claims"
              className="admin-dashboard-card claims"
            >
              <div className="admin-dashboard-card-icon">
                ♢
              </div>

              <span>
                ADMIN · 04
              </span>

              <h3>
                Claim requests
              </h3>

              <p>
                Review ownership requests and approve or reject
                claims submitted by community members.
              </p>

              <strong>
                Review claims
                <b>→</b>
              </strong>
            </Link>

            <Link
              to="/admin/items"
              className="admin-dashboard-card items"
            >
           <div className="admin-dashboard-card-icon">
    ◉
            </div>

           <span>
             ADMIN · 05
           </span>

          <h3>
            Item management
         </h3>

          <p>
            Review lost, found and claimed reports
           currently stored in FindLost.
          </p>

          <strong>
           Manage items
            <b>→</b>
           </strong>
          </Link>

          </div>

        </section>


        {/* ==================================================
            FOOTER NOTE
            ================================================== */}

        <section className="admin-dashboard-note">

          <div className="admin-dashboard-note-icon">
            ✓
          </div>

          <div>

            <span>
              FINDLOST ADMIN
            </span>

            <h2>
              Small actions keep the
              <br />
              community moving.
            </h2>

            <p>
              Review messages, keep reports organized,
              and help people reconnect with what they
              have lost.
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

export default AdminDashboard;