import { Link } from "react-router-dom";
import "./HowItWorks.css";

function HowItWorks() {
  return (
    <div className="how-it-works-page">

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="how-shape how-shape-one"></div>
      <div className="how-shape how-shape-two"></div>
      <div className="how-shape how-shape-three"></div>


      <div className="how-wrapper">

        {/* ===================================================
            HERO
            =================================================== */}

        <section className="how-hero">

          <div className="how-eyebrow">
            <span></span>
            HOW FINDLOST WORKS
          </div>


          <h1>
            Lost something?
            <br />
            <em>Let's bring it home.</em>
          </h1>


          <p>
            FindLost makes it easier to report lost belongings,
            share found items, and help people reconnect with
            the things that matter to them.
          </p>

        </section>


        {/* ===================================================
            SIMPLE FLOW
            =================================================== */}

        <section className="how-flow">

          <div className="how-section-heading">

            <span>
              THE SIMPLE WAY
            </span>

            <h2>
              From lost to found,
              <br />
              one step at a time.
            </h2>

          </div>


          <div className="how-flow-grid">

            <div className="how-step">

              <div className="how-step-number">
                01
              </div>

              <div className="how-step-icon lost-icon">
                ?
              </div>

              <h3>
                Report it
              </h3>

              <p>
                Lost something? Add the item name,
                description, location and an optional
                photo so others can recognize it.
              </p>

              <Link to="/report-lost">
                Report lost item
                <span>→</span>
              </Link>

            </div>


            <div className="how-step">

              <div className="how-step-number">
                02
              </div>

              <div className="how-step-icon found-icon">
                ✓
              </div>

              <h3>
                Find something
              </h3>

              <p>
                Found an item that belongs to someone?
                Report it with clear details and help
                it reach the right person.
              </p>

              <Link to="/report-found">
                Report found item
                <span>→</span>
              </Link>

            </div>


            <div className="how-step">

              <div className="how-step-number">
                03
              </div>

              <div className="how-step-icon claim-icon">
                ♢
              </div>

              <h3>
                Make a claim
              </h3>

              <p>
                Think a found item belongs to you?
                Submit a claim and explain the details
                that help verify your ownership.
              </p>

              <Link to="/found-items">
                Browse found items
                <span>→</span>
              </Link>

            </div>


            <div className="how-step">

              <div className="how-step-number">
                04
              </div>

              <div className="how-step-icon home-icon">
                ✦
              </div>

              <h3>
                Bring it home
              </h3>

              <p>
                The person who reported the item can
                review a claim and approve it when the
                details make sense.
              </p>

              <Link to="/my-claims">
                View my claims
                <span>→</span>
              </Link>

            </div>

          </div>

        </section>


        {/* ===================================================
            LOST / FOUND SPLIT
            =================================================== */}

        <section className="how-split">

          <div className="how-split-card lost-card">

            <div className="how-split-badge">
              LOST
            </div>

            <h2>
              Looking for
              <br />
              something?
            </h2>

            <p>
              Search recently reported lost items and
              see whether someone has already found what
              you're looking for.
            </p>

            <Link to="/lost-items">
              Browse lost items
              <span>→</span>
            </Link>

          </div>


          <div className="how-split-card found-card">

            <div className="how-split-badge">
              FOUND
            </div>

            <h2>
              Found something
              <br />
              useful?
            </h2>

            <p>
              Browse found items, check their details,
              and submit a claim when you believe something
              belongs to you.
            </p>

            <Link to="/found-items">
              Browse found items
              <span>→</span>
            </Link>

          </div>

        </section>


        {/* ===================================================
            TRUST SECTION
            =================================================== */}

        <section className="how-trust">

          <div className="how-trust-icon">
            ✓
          </div>

          <div>

            <span>
              A LITTLE CARE GOES A LONG WAY
            </span>

            <h2>
              Every useful detail
              <br />
              helps someone get closer to home.
            </h2>

            <p>
              Take a moment to describe an item clearly.
              A location, identifying mark or good photo
              can make it much easier for someone to
              recognize what they're looking for.
            </p>

          </div>

        </section>


        {/* ===================================================
            FINAL CTA
            =================================================== */}

        <section className="how-final">

          <div className="how-final-eyebrow">
            READY WHEN YOU ARE
          </div>

          <h2>
            Something missing?
            <br />
            <span>Something found?</span>
          </h2>

          <p>
            Start with one small report.
            It might make someone's day.
          </p>


          <div className="how-final-actions">

            <Link
              to="/report-lost"
              className="how-primary-button"
            >
              Report lost item
              <span>→</span>
            </Link>


            <Link
              to="/report-found"
              className="how-secondary-button"
            >
              Report found item
              <span>→</span>
            </Link>

          </div>

        </section>

      </div>

    </div>
  );
}

export default HowItWorks;