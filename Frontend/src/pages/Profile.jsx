import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    loadProfile();
  }, []);


  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/users/profile"
      );

      setProfile(response.data);
      setName(response.data?.name || "");

    } catch (err) {
      console.error(
        "Loading profile failed:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You don't have permission to view your profile."
        );
      } else {
        setError(
          "Unable to load your profile right now."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }


    try {
      setSaving(true);

      const response = await api.put(
        "/api/users/profile",
        {
          name: name.trim(),
        }
      );

      setProfile(response.data);

      setName(response.data?.name || "");

      setEditing(false);

      setSuccess(
        "Your profile was updated successfully."
      );

    } catch (err) {
      console.error(
        "Updating profile failed:",
        err
      );

      if (err.response?.data?.message) {
        setError(
          err.response.data.message
        );
      } else if (
        err.response?.status === 401
      ) {
        setError(
          "Your session has expired. Please log in again."
        );
      } else {
        setError(
          "Unable to update your profile right now."
        );
      }
    } finally {
      setSaving(false);
    }
  };


  const handleCancel = () => {
    setName(profile?.name || "");

    setEditing(false);

    setError("");
    setSuccess("");
  };


  const getInitial = () => {
    return (
      profile?.name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "U"
    );
  };


  if (loading) {
    return (
      <div className="profile-page profile-state-page">

        <div className="profile-state-card">

          <div className="profile-spinner"></div>

          <span>
            MY PROFILE
          </span>

          <h2>
            Loading your profile...
          </h2>

          <p>
            We're bringing your account details
            into view.
          </p>

        </div>

      </div>
    );
  }


  if (!profile) {
    return (
      <div className="profile-page profile-state-page">

        <div className="profile-state-card error">

          <div className="profile-error-icon">
            !
          </div>

          <span>
            MY PROFILE
          </span>

          <h2>
            Profile unavailable
          </h2>

          <p>
            {error ||
              "We couldn't load your profile."}
          </p>

          <button
            type="button"
            className="profile-retry-button"
            onClick={loadProfile}
          >
            Try again
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="profile-page">

      <div className="profile-shape profile-shape-one"></div>

      <div className="profile-shape profile-shape-two"></div>

      <div className="profile-shape profile-shape-three"></div>


      <div className="profile-wrapper">

        {/* ==================================================
            HERO
            ================================================== */}

        <section className="profile-hero">

          <div className="profile-eyebrow">
            <span></span>
            MY PROFILE
          </div>

          <h1>
            Your FindLost
            <br />
            <em>account, your way.</em>
          </h1>

          <p>
            Keep your account details up to date
            and make your FindLost experience feel like yours.
          </p>

        </section>


        {/* ==================================================
            PROFILE CARD
            ================================================== */}

        <section className="profile-card">

          <div className="profile-card-top">

            <div className="profile-avatar-large">
              {getInitial()}
            </div>


            <div className="profile-heading">

              <span>
                ACCOUNT PROFILE
              </span>

              <h2>
                {profile.name}
              </h2>

              <p>
                {profile.email}
              </p>

            </div>


            {!editing && (
              <button
                type="button"
                className="profile-edit-button"
                onClick={() => {
                  setEditing(true);
                  setError("");
                  setSuccess("");
                }}
              >
                Edit profile
                <span>✦</span>
              </button>
            )}

          </div>


          <div className="profile-divider"></div>


          {success && (
            <div className="profile-success">
              <span>✓</span>
              {success}
            </div>
          )}


          {error && (
            <div className="profile-error">
              <span>!</span>
              {error}
            </div>
          )}


          {!editing ? (

            <div className="profile-details">

              <div className="profile-detail-card">

                <span>
                  FULL NAME
                </span>

                <strong>
                  {profile.name}
                </strong>

              </div>


              <div className="profile-detail-card">

                <span>
                  EMAIL ADDRESS
                </span>

                <strong>
                  {profile.email}
                </strong>

              </div>


              <div className="profile-detail-card">

                <span>
                  ACCOUNT TYPE
                </span>

                <strong>
                  {profile.role}
                </strong>

              </div>


              <div className="profile-detail-card">

                <span>
                  ACCOUNT ID
                </span>

                <strong>
                  #{profile.id}
                </strong>

              </div>

            </div>

          ) : (

            <form
              className="profile-edit-form"
              onSubmit={handleSave}
            >

              <div className="profile-edit-field">

                <label htmlFor="profile-name">
                  Full name
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  disabled={saving}
                  autoFocus
                />

              </div>


              <div className="profile-readonly-field">

                <span>
                  EMAIL ADDRESS
                </span>

                <strong>
                  {profile.email}
                </strong>

                <small>
                  Email changes are not available here.
                </small>

              </div>


              <div className="profile-edit-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save changes"}
                </button>

              </div>

            </form>
          )}

        </section>


        {/* ==================================================
            ACCOUNT NOTE
            ================================================== */}

        <section className="profile-note">

          <div className="profile-note-icon">
            ✓
          </div>

          <div>

            <span>
              FINDLOST ACCOUNT
            </span>

            <h2>
              One profile.
              <br />
              Everything in one place.
            </h2>

            <p>
              Your profile is connected to the items
              you've reported, claims you've submitted,
              and the conversations you've started.
            </p>

          </div>

        </section>


        {/* ==================================================
            QUICK LINKS
            ================================================== */}

        <section className="profile-links">

          <Link
            to="/my-items"
            className="profile-link-card"
          >
            <span>
              YOUR REPORTS
            </span>

            <strong>
              My Items
              <b>→</b>
            </strong>
          </Link>


          <Link
            to="/my-claims"
            className="profile-link-card"
          >
            <span>
              YOUR REQUESTS
            </span>

            <strong>
              My Claims
              <b>→</b>
            </strong>
          </Link>

        </section>

      </div>

    </div>
  );
}

export default Profile;