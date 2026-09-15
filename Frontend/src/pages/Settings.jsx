import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Settings.css";

function Settings() {
  const [profile, setProfile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");


  useEffect(() => {
    loadProfile();
  }, []);


  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      setProfileError("");

      const response = await api.get(
        "/api/users/profile"
      );

      setProfile(response.data);

    } catch (err) {
      console.error(
        "Loading settings profile failed:",
        err
      );

      if (err.response?.status === 401) {
        setProfileError(
          "Your session has expired. Please log in again."
        );
      } else if (err.response?.status === 403) {
        setProfileError(
          "You don't have permission to view these settings."
        );
      } else {
        setProfileError(
          "Unable to load your account details right now."
        );
      }
    } finally {
      setLoadingProfile(false);
    }
  };


  const handlePasswordChange = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");


    if (!currentPassword.trim()) {
      setPasswordError(
        "Please enter your current password."
      );
      return;
    }


    if (!newPassword.trim()) {
      setPasswordError(
        "Please enter a new password."
      );
      return;
    }


    if (newPassword.length < 6) {
      setPasswordError(
        "Your new password must contain at least 6 characters."
      );
      return;
    }


    if (!confirmPassword.trim()) {
      setPasswordError(
        "Please confirm your new password."
      );
      return;
    }


    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirmation do not match."
      );
      return;
    }


    if (currentPassword === newPassword) {
      setPasswordError(
        "Your new password must be different from the current password."
      );
      return;
    }


    try {
      setChangingPassword(true);

      const response = await api.put(
        "/api/users/password",
        {
          currentPassword,
          newPassword,
        }
      );

      setPasswordSuccess(
        response.data?.message ||
          "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error(
        "Changing password failed:",
        err
      );

      if (err.response?.data?.message) {
        setPasswordError(
          err.response.data.message
        );
      } else if (err.response?.status === 401) {
        setPasswordError(
          "Your session has expired. Please log in again."
        );
      } else {
        setPasswordError(
          "Unable to change your password right now."
        );
      }
    } finally {
      setChangingPassword(false);
    }
  };


  const getInitial = () => {
    return (
      profile?.name
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase() || "U"
    );
  };


  return (
    <div className="settings-page">

      <div className="settings-shape settings-shape-one"></div>
      <div className="settings-shape settings-shape-two"></div>
      <div className="settings-shape settings-shape-three"></div>


      <div className="settings-wrapper">

        {/* ==================================================
            HERO
            ================================================== */}

        <section className="settings-hero">

          <div className="settings-eyebrow">
            <span></span>
            ACCOUNT SETTINGS
          </div>

          <h1>
            Make your account
            <br />
            <em>feel like yours.</em>
          </h1>

          <p>
            Manage your account details, protect your access,
            and keep your FindLost experience in your hands.
          </p>

        </section>


        {/* ==================================================
            ACCOUNT CARD
            ================================================== */}

        <section className="settings-account-card">

          <div className="settings-account-top">

            <div className="settings-account-avatar">
              {loadingProfile
                ? "..."
                : getInitial()}
            </div>


            <div className="settings-account-heading">

              <span>
                ACCOUNT
              </span>

              {loadingProfile ? (
                <>
                  <h2>
                    Loading profile...
                  </h2>

                  <p>
                    Please wait a moment.
                  </p>
                </>
              ) : profile ? (
                <>
                  <h2>
                    {profile.name}
                  </h2>

                  <p>
                    {profile.email}
                  </p>
                </>
              ) : (
                <>
                  <h2>
                    Profile unavailable
                  </h2>

                  <p>
                    {profileError}
                  </p>
                </>
              )}

            </div>


            {profile && (
              <div className="settings-account-role">
                <span>
                  ACCOUNT TYPE
                </span>

                <strong>
                  {profile.role}
                </strong>
              </div>
            )}

          </div>


          {profileError && (
            <div className="settings-profile-error">
              <span>!</span>
              {profileError}
            </div>
          )}


          {profile && (
            <div className="settings-account-details">

              <div className="settings-account-detail">

                <span>
                  FULL NAME
                </span>

                <strong>
                  {profile.name}
                </strong>

              </div>


              <div className="settings-account-detail">

                <span>
                  EMAIL ADDRESS
                </span>

                <strong>
                  {profile.email}
                </strong>

              </div>


              <div className="settings-account-detail">

                <span>
                  ACCOUNT ID
                </span>

                <strong>
                  #{profile.id}
                </strong>

              </div>


              <Link
                to="/profile"
                className="settings-profile-link"
              >
                View profile
                <span>→</span>
              </Link>

            </div>
          )}

        </section>


        {/* ==================================================
            SECURITY
            ================================================== */}

        <section className="settings-security-card">

          <div className="settings-security-heading">

            <div className="settings-security-icon">
              ◆
            </div>

            <div>

              <span>
                SECURITY
              </span>

              <h2>
                Keep your account protected.
              </h2>

              <p>
                Choose a password that is strong, memorable,
                and known only to you.
              </p>

            </div>

          </div>


          {passwordSuccess && (
            <div className="settings-password-success">
              <span>✓</span>
              {passwordSuccess}
            </div>
          )}


          {passwordError && (
            <div className="settings-password-error">
              <span>!</span>
              {passwordError}
            </div>
          )}


          <form
            className="settings-password-form"
            onSubmit={handlePasswordChange}
          >

            <div className="settings-form-group">

              <label htmlFor="currentPassword">
                Current password
              </label>

              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your current password"
                disabled={changingPassword}
                autoComplete="current-password"
              />

            </div>


            <div className="settings-form-row">

              <div className="settings-form-group">

                <label htmlFor="newPassword">
                  New password
                </label>

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="At least 6 characters"
                  disabled={changingPassword}
                  autoComplete="new-password"
                />

              </div>


              <div className="settings-form-group">

                <label htmlFor="confirmPassword">
                  Confirm new password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Re-enter your new password"
                  disabled={changingPassword}
                  autoComplete="new-password"
                />

              </div>

            </div>


            <div className="settings-password-footer">

              <p>
                Your current session remains active after
                changing the password.
              </p>

              <button
                type="submit"
                className="settings-password-button"
                disabled={changingPassword}
              >
                {changingPassword
                  ? "Changing password..."
                  : "Change password"}

                {!changingPassword && (
                  <span>→</span>
                )}
              </button>

            </div>

          </form>

        </section>


        {/* ==================================================
            QUICK ACCESS
            ================================================== */}

        <section className="settings-quick-section">

          <div className="settings-section-heading">

            <span>
              QUICK ACCESS
            </span>

            <h2>
              Keep moving through FindLost.
            </h2>

          </div>


          <div className="settings-quick-grid">

            <Link
              to="/my-items"
              className="settings-quick-card reports"
            >
              <div className="settings-quick-icon">
                ◇
              </div>

              <div>

                <span>
                  YOUR REPORTS
                </span>

                <h3>
                  My Items
                </h3>

                <p>
                  Manage the items you've reported
                  to the community.
                </p>

              </div>

              <strong>
                Open
                <b>→</b>
              </strong>

            </Link>


            <Link
              to="/my-claims"
              className="settings-quick-card claims"
            >
              <div className="settings-quick-icon">
                ✓
              </div>

              <div>

                <span>
                  YOUR REQUESTS
                </span>

                <h3>
                  My Claims
                </h3>

                <p>
                  Follow the claims you've submitted
                  and their latest status.
                </p>

              </div>

              <strong>
                Open
                <b>→</b>
              </strong>

            </Link>


            <Link
              to="/contact"
              className="settings-quick-card contact"
            >
              <div className="settings-quick-icon">
                ✦
              </div>

              <div>

                <span>
                  NEED HELP?
                </span>

                <h3>
                  Contact FindLost
                </h3>

                <p>
                  Have a question or something
                  you'd like us to know?
                </p>

              </div>

              <strong>
                Contact
                <b>→</b>
              </strong>

            </Link>

          </div>

        </section>


        {/* ==================================================
            SECURITY NOTE
            ================================================== */}

        <section className="settings-security-note">

          <div className="settings-security-note-icon">
            ✓
          </div>

          <div>

            <span>
              FINDLOST SECURITY
            </span>

            <h2>
              Your account stays yours.
            </h2>

            <p>
              FindLost keeps your password protected and
              never displays it inside your profile or settings.
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Settings;