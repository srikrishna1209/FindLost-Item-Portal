import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminContactMessages.css";

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    new: 0,
    read: 0,
    resolved: 0,
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);


  useEffect(() => {
    loadMessages();
  }, []);


  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const [messagesResponse, statsResponse] =
        await Promise.all([
          api.get("/api/admin/contact-messages"),
          api.get("/api/admin/contact-messages/stats"),
        ]);

      setMessages(
        Array.isArray(messagesResponse.data)
          ? messagesResponse.data
          : []
      );

      setStats({
        new: Number(statsResponse.data?.new || 0),
        read: Number(statsResponse.data?.read || 0),
        resolved: Number(statsResponse.data?.resolved || 0),
      });
    } catch (err) {
      console.error(
        "Loading admin contact messages failed:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Please log in to access the admin area."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to access the admin area."
        );
      } else {
        setError(
          "Unable to load contact messages right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await api.put(
        `/api/admin/contact-messages/${id}/status`,
        null,
        {
          params: {
            status,
          },
        }
      );

      const updatedMessage = response.data;

      setMessages((previous) =>
        previous.map((message) =>
          message.id === id
            ? updatedMessage
            : message
        )
      );

      setStats((previous) => {
        const next = {
          ...previous,
          new: previous.new,
          read: previous.read,
          resolved: previous.resolved,
        };

        return recalculateStats(
          messages.map((message) =>
            message.id === id
              ? updatedMessage
              : message
          )
        );
      });
    } catch (err) {
      console.error(
        "Updating contact message status failed:",
        err
      );

      if (err.response?.status === 403) {
        setError(
          "You are not allowed to update contact messages."
        );
      } else {
        setError(
          "Unable to update this message right now."
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };


  const recalculateStats = (list) => {
    return {
      new: list.filter(
        (message) =>
          message.status?.toUpperCase() === "NEW"
      ).length,

      read: list.filter(
        (message) =>
          message.status?.toUpperCase() === "READ"
      ).length,

      resolved: list.filter(
        (message) =>
          message.status?.toUpperCase() === "RESOLVED"
      ).length,
    };
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


  const getNextAction = (status) => {
    const normalized =
      status?.toUpperCase();

    if (normalized === "NEW") {
      return {
        label: "Mark as read",
        status: "READ",
      };
    }

    if (normalized === "READ") {
      return {
        label: "Mark resolved",
        status: "RESOLVED",
      };
    }

    return null;
  };


  if (loading) {
    return (
      <div className="admin-contact-page admin-contact-state-page">
        <div className="admin-contact-state-card">
          <div className="admin-contact-spinner"></div>

          <span>ADMIN AREA</span>

          <h2>
            Opening your inbox...
          </h2>

          <p>
            We're bringing in the latest FindLost
            contact messages.
          </p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="admin-contact-page admin-contact-state-page">
        <div className="admin-contact-state-card error">

          <div className="admin-contact-state-icon">
            !
          </div>

          <span>ADMIN AREA</span>

          <h2>
            Access unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={loadMessages}
            className="admin-contact-retry"
          >
            Try again
          </button>

        </div>
      </div>
    );
  }


  return (
    <div className="admin-contact-page">

      <div className="admin-contact-shape admin-contact-shape-one"></div>

      <div className="admin-contact-shape admin-contact-shape-two"></div>

      <div className="admin-contact-shape admin-contact-shape-three"></div>


      <div className="admin-contact-wrapper">

        {/* ==================================================
            HERO
            ================================================== */}

        <section className="admin-contact-hero">

          <div className="admin-contact-eyebrow">
            <span></span>
            ADMIN · CONTACT INBOX
          </div>

          <h1>
            Messages that
            <br />
            <em>need your attention.</em>
          </h1>

          <p>
            Review questions, feedback and requests
            submitted through the FindLost contact page.
          </p>

        </section>


        {/* ==================================================
            STATS
            ================================================== */}

        <section className="admin-contact-stats">

          <div className="admin-contact-stat new">
            <span>NEW</span>
            <strong>{stats.new}</strong>
            <small>Awaiting review</small>
          </div>


          <div className="admin-contact-stat read">
            <span>READ</span>
            <strong>{stats.read}</strong>
            <small>Already reviewed</small>
          </div>


          <div className="admin-contact-stat resolved">
            <span>RESOLVED</span>
            <strong>{stats.resolved}</strong>
            <small>Completed conversations</small>
          </div>

        </section>


        {/* ==================================================
            HEADER
            ================================================== */}

        <section className="admin-contact-list-header">

          <div>

            <span>
              INBOX
            </span>

            <h2>
              Contact messages
            </h2>

          </div>

          <button
            type="button"
            onClick={loadMessages}
            className="admin-contact-refresh"
          >
            Refresh inbox
            <span>↻</span>
          </button>

        </section>


        {/* ==================================================
            MESSAGES
            ================================================== */}

        {messages.length === 0 ? (

          <div className="admin-contact-empty">

            <div className="admin-contact-empty-icon">
              ✓
            </div>

            <span>
              ALL CLEAR
            </span>

            <h3>
              No contact messages yet.
            </h3>

            <p>
              Messages submitted through the Contact page
              will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-contact-list">

            {messages.map((message) => {

              const status =
                message.status?.toUpperCase() || "NEW";

              const action =
                getNextAction(status);

              const expanded =
                expandedId === message.id;


              return (
                <article
                  key={message.id}
                  className={`admin-contact-message-card ${status.toLowerCase()}`}
                >

                  <div className="admin-contact-message-top">

                    <div className="admin-contact-message-person">

                      <div className="admin-contact-avatar">
                        {message.name
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </div>

                      <div>

                        <h3>
                          {message.name || "Unknown sender"}
                        </h3>

                        <a
                          href={`mailto:${message.email}`}
                        >
                          {message.email}
                        </a>

                      </div>

                    </div>


                    <span
                      className={`admin-contact-status ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>

                  </div>


                  <div className="admin-contact-message-meta">

                    <span>
                      {message.subject?.trim()
                        ? message.subject
                        : "No subject"}
                    </span>

                    <time>
                      {formatDate(message.createdAt)}
                    </time>

                  </div>


                  <div
                    className={`admin-contact-message-body ${
                      expanded ? "expanded" : ""
                    }`}
                  >
                    {message.message ||
                      "No message content."}
                  </div>


                  <div className="admin-contact-message-actions">

                    <button
                      type="button"
                      className="admin-contact-view"
                      onClick={() =>
                        setExpandedId(
                          expanded
                            ? null
                            : message.id
                        )
                      }
                    >
                      {expanded
                        ? "Hide message"
                        : "View message"}
                    </button>


                    <div className="admin-contact-actions-right">

                      {action && (
                        <button
                          type="button"
                          className={`admin-contact-action-button ${action.status.toLowerCase()}`}
                          disabled={
                            updatingId === message.id
                          }
                          onClick={() =>
                            updateStatus(
                              message.id,
                              action.status
                            )
                          }
                        >
                          {updatingId === message.id
                            ? "Updating..."
                            : action.label}
                        </button>
                      )}

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}


        <section className="admin-contact-footer-note">

          <span>FINDLOST</span>

          <p>
            Keep conversations organized so every
            message gets the attention it deserves.
          </p>

        </section>

      </div>
    </div>
  );
}


export default AdminContactMessages;