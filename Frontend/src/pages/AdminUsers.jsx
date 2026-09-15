import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [stats, setStats] = useState({
    total: 0,
    users: 0,
    admins: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, statsResponse] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/admin/users/stats"),
      ]);

      setUsers(
        Array.isArray(usersResponse.data) ? usersResponse.data : []
      );

      setStats({
        total: Number(statsResponse.data?.total || 0),
        users: Number(statsResponse.data?.users || 0),
        admins: Number(statsResponse.data?.admins || 0),
      });
    } catch (err) {
      console.error("Loading admin users failed:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to access user management."
        );
      } else {
        setError("Unable to load users right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    return users.filter((user) => {
      const role = user.role?.toUpperCase() || "USER";

      const matchesRole =
        roleFilter === "ALL" || role === roleFilter;

      const matchesSearch =
        !text ||
        user.name?.toLowerCase().includes(text) ||
        user.email?.toLowerCase().includes(text) ||
        String(user.id || "").includes(text);

      return matchesRole && matchesSearch;
    });
  }, [users, searchText, roleFilter]);

  const getInitial = (name) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const getRoleLabel = (role) =>
    role?.toUpperCase() || "USER";

  if (loading) {
    return (
      <div className="admin-users-page admin-users-state-page">
        <div className="admin-users-state-card">
          <div className="admin-users-spinner"></div>
          <span>ADMIN · USER MANAGEMENT</span>
          <h2>Opening the community...</h2>
          <p>
            We're bringing in the latest FindLost account
            information.
          </p>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="admin-users-page admin-users-state-page">
        <div className="admin-users-state-card error">
          <div className="admin-users-error-icon">!</div>
          <span>ADMIN · USER MANAGEMENT</span>
          <h2>Users unavailable</h2>
          <p>{error}</p>
          <button
            type="button"
            className="admin-users-retry"
            onClick={loadUsers}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="admin-users-shape admin-users-shape-one"></div>
      <div className="admin-users-shape admin-users-shape-two"></div>
      <div className="admin-users-shape admin-users-shape-three"></div>

      <div className="admin-users-wrapper">
        <section className="admin-users-hero">
          <div className="admin-users-eyebrow">
            <span></span>
            ADMIN · USER MANAGEMENT
          </div>

          <h1>
            The people behind
            <br />
            <em>the FindLost community.</em>
          </h1>

          <p>
            Browse registered accounts, understand the
            community at a glance, and keep administration
            organized in one place.
          </p>
        </section>

        <section className="admin-users-stats">
          <button
            type="button"
            className={`admin-users-stat total ${
              roleFilter === "ALL" ? "active" : ""
            }`}
            onClick={() => setRoleFilter("ALL")}
          >
            <span>ALL ACCOUNTS</span>
            <strong>{stats.total}</strong>
            <small>Every registered account</small>
          </button>

          <button
            type="button"
            className={`admin-users-stat members ${
              roleFilter === "USER" ? "active" : ""
            }`}
            onClick={() => setRoleFilter("USER")}
          >
            <span>USERS</span>
            <strong>{stats.users}</strong>
            <small>Community members</small>
          </button>

          <button
            type="button"
            className={`admin-users-stat admins ${
              roleFilter === "ADMIN" ? "active" : ""
            }`}
            onClick={() => setRoleFilter("ADMIN")}
          >
            <span>ADMINS</span>
            <strong>{stats.admins}</strong>
            <small>Administrative accounts</small>
          </button>
        </section>

        <section className="admin-users-toolbar">
          <div className="admin-users-heading">
            <span>COMMUNITY</span>
            <h2>Registered accounts</h2>
          </div>

          <div className="admin-users-controls">
            <div className="admin-users-search">
              <span>⌕</span>

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search by name, email or ID..."
                aria-label="Search users"
              />

              {searchText && (
                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="button"
              className="admin-users-refresh"
              onClick={loadUsers}
            >
              Refresh
              <span>↻</span>
            </button>
          </div>
        </section>

        {error && users.length > 0 && (
          <div className="admin-users-inline-error">
            {error}
          </div>
        )}

        <div className="admin-users-results-meta">
          <span>
            Showing <strong>{filteredUsers.length}</strong>
            {filteredUsers.length === 1 ? " account" : " accounts"}
          </span>

          {(searchText || roleFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setRoleFilter("ALL");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredUsers.length === 0 ? (
          <div className="admin-users-empty">
            <div className="admin-users-empty-icon">⌕</div>
            <span>NO MATCHES</span>
            <h3>No accounts match your search.</h3>
            <p>
              Try another name, email address, or account ID.
            </p>
          </div>
        ) : (
          <div className="admin-users-list">
            {filteredUsers.map((user) => {
              const role = getRoleLabel(user.role);
              const isAdmin = role === "ADMIN";

              return (
                <article
                  key={user.id}
                  className={`admin-user-card ${
                    isAdmin ? "admin" : "user"
                  }`}
                >
                  <div className="admin-user-avatar">
                    {getInitial(user.name)}
                  </div>

                  <div className="admin-user-main">
                    <div className="admin-user-meta">
                      <span>ACCOUNT #{user.id}</span>

                      <span
                        className={`admin-user-role ${
                          isAdmin ? "admin" : "user"
                        }`}
                      >
                        {role}
                      </span>
                    </div>

                    <h3>{user.name || "Unnamed user"}</h3>

                    <a
                      href={
                        user.email
                          ? `mailto:${user.email}`
                          : undefined
                      }
                      className="admin-user-email"
                    >
                      {user.email || "No email available"}
                    </a>
                  </div>

                  <div className="admin-user-summary">
                    <span>ACCOUNT STATUS</span>
                    <strong>Active</strong>
                    <small>Registered FindLost account</small>
                  </div>

                  <div className="admin-user-action">
                    <a
                      href={
                        user.email
                          ? `mailto:${user.email}`
                          : undefined
                      }
                      className="admin-user-view"
                    >
                      Contact user
                      <b>→</b>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <section className="admin-users-footer-note">
          <div className="admin-users-footer-icon">✦</div>

          <div>
            <span>FINDLOST ADMIN</span>

            <h2>
              A healthy community starts
              <br />
              with people who care.
            </h2>

            <p>
              Keep the platform organized, respectful, and
              welcoming for everyone searching for what they lost.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminUsers;