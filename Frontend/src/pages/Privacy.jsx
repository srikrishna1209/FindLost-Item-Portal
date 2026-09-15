import { Link } from "react-router-dom";
import "./Privacy.css";

function Privacy() {
  return (
    <div className="privacy-page">
      <div className="privacy-shape privacy-shape-one"></div>
      <div className="privacy-shape privacy-shape-two"></div>
      <div className="privacy-shape privacy-shape-three"></div>

      <div className="privacy-wrapper">

        <section className="privacy-hero">
          <div className="privacy-eyebrow">
            <span></span>
            FINDLOST PRIVACY
          </div>

          <h1>
            Your information
            <br />
            <em>should feel safe here.</em>
          </h1>

          <p>
            This page explains the kinds of information FindLost
            uses to provide the account, reporting, claims, and
            contact features in the application.
          </p>
        </section>

        <div className="privacy-layout">

          <aside className="privacy-sidebar">
            <span>ON THIS PAGE</span>

            <a href="#information">
              Information we use
            </a>

            <a href="#purpose">
              Why we use it
            </a>

            <a href="#account">
              Account security
            </a>

            <a href="#your-choice">
              Your choices
            </a>
          </aside>

          <main className="privacy-content">

            <section
              id="information"
              className="privacy-card coral"
            >
              <div className="privacy-card-number">
                01
              </div>

              <div className="privacy-card-icon">
                ◇
              </div>

              <h2>
                Information we use
              </h2>

              <p>
                To provide the FindLost experience, the application
                may store information you submit through its features.
              </p>

              <ul>
                <li>
                  Account details such as your name and email address.
                </li>

                <li>
                  Lost and found item information such as descriptions,
                  locations, and images you provide.
                </li>

                <li>
                  Claim messages and related request information.
                </li>

                <li>
                  Messages submitted through the Contact FindLost form.
                </li>
              </ul>
            </section>

            <section
              id="purpose"
              className="privacy-card sage"
            >
              <div className="privacy-card-number">
                02
              </div>

              <div className="privacy-card-icon">
                ✓
              </div>

              <h2>
                Why we use it
              </h2>

              <p>
                The information you provide is used to make the
                application's core workflows possible.
              </p>

              <div className="privacy-purpose-grid">
                <div>
                  <strong>Accounts</strong>
                  <span>
                    Sign in and manage your profile.
                  </span>
                </div>

                <div>
                  <strong>Reports</strong>
                  <span>
                    Create and display lost or found item reports.
                  </span>
                </div>

                <div>
                  <strong>Claims</strong>
                  <span>
                    Submit and review ownership requests.
                  </span>
                </div>

                <div>
                  <strong>Contact</strong>
                  <span>
                    Receive and organize messages sent to FindLost.
                  </span>
                </div>
              </div>
            </section>

            <section
              id="account"
              className="privacy-card lavender"
            >
              <div className="privacy-card-number">
                03
              </div>

              <div className="privacy-card-icon">
                ◆
              </div>

              <h2>
                Account security
              </h2>

              <p>
                Passwords are not displayed in the profile interface.
                The application uses the existing authentication flow
                to protect account access.
              </p>

              <div className="privacy-security-note">
                <span>SECURITY NOTE</span>

                <strong>
                  Keep your login credentials private.
                </strong>

                <p>
                  FindLost administrators should not need your password
                  in order to review an item, claim, or contact message.
                </p>
              </div>
            </section>

            <section
              id="your-choice"
              className="privacy-card gold"
            >
              <div className="privacy-card-number">
                04
              </div>

              <div className="privacy-card-icon">
                ✦
              </div>

              <h2>
                Your choices
              </h2>

              <p>
                You control the information you submit through the
                application. You can review your profile and update
                supported account information from the Profile and
                Settings pages.
              </p>

              <div className="privacy-choice-actions">
                <Link to="/profile">
                  View profile
                  <b>→</b>
                </Link>

                <Link to="/settings">
                  Open settings
                  <b>→</b>
                </Link>

                <Link to="/contact">
                  Contact FindLost
                  <b>→</b>
                </Link>
              </div>
            </section>

          </main>
        </div>

        <section className="privacy-footer-note">
          <div className="privacy-footer-icon">
            ✓
          </div>

          <div>
            <span>FINDLOST</span>

            <h2>
              Privacy should be understandable.
            </h2>

            <p>
              This page describes the data use represented by the
              current FindLost application. For questions about how
              your information is handled in this project, contact us
              through the Contact page.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Privacy;