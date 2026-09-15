import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <div className="about-shape about-shape-one"></div>
      <div className="about-shape about-shape-two"></div>
      <div className="about-shape about-shape-three"></div>

      <div className="about-wrapper">

        <section className="about-hero">
          <div className="about-eyebrow">
            <span></span>
            ABOUT FINDLOST
          </div>

          <h1>
            Lost things deserve
            <br />
            <em>a way back home.</em>
          </h1>

          <p>
            FindLost is a community-focused lost and found platform
            designed to make reporting, discovering, and returning
            belongings simple and human.
          </p>
        </section>

        <section className="about-intro-card">
          <div className="about-intro-icon">✦</div>

          <div>
            <span>WHY FINDLOST EXISTS</span>

            <h2>
              A little easier to report.
              <br />
              A little easier to find.
            </h2>

            <p>
              Losing something can be frustrating, especially when
              you don't know where to begin looking. FindLost brings
              reports, found items, claims, and communication together
              in one place so people can move from uncertainty toward
              a possible reunion.
            </p>
          </div>
        </section>

        <section className="about-values-section">
          <div className="about-section-heading">
            <span>THE FINDLOST IDEA</span>

            <h2>
              Simple tools.
              <br />
              Real people.
              <br />
              Better outcomes.
            </h2>
          </div>

          <div className="about-values-grid">
            <article className="about-value-card coral">
              <div className="about-value-number">01</div>
              <div className="about-value-icon">◇</div>

              <h3>Report clearly</h3>

              <p>
                Add useful details about a lost or found item so
                others can recognize it and act on the information.
              </p>
            </article>

            <article className="about-value-card sage">
              <div className="about-value-number">02</div>
              <div className="about-value-icon">✓</div>

              <h3>Discover easily</h3>

              <p>
                Browse community reports and use item details,
                locations, and descriptions to find possible matches.
              </p>
            </article>

            <article className="about-value-card gold">
              <div className="about-value-number">03</div>
              <div className="about-value-icon">♢</div>

              <h3>Verify ownership</h3>

              <p>
                Claims let someone explain why a found item belongs
                to them before the return process moves forward.
              </p>
            </article>

            <article className="about-value-card lavender">
              <div className="about-value-number">04</div>
              <div className="about-value-icon">✦</div>

              <h3>Bring it home</h3>

              <p>
                The goal is simple: help the right person reconnect
                with something that matters to them.
              </p>
            </article>
          </div>
        </section>

        <section className="about-story-card">
          <div className="about-story-copy">
            <span>THE HEART OF FINDLOST</span>

            <h2>
              Every report is a small
              <br />
              act of helping.
            </h2>

            <p>
              Someone who reports an item may never meet the person
              who eventually gets it back. Someone who checks the
              found-item list may be doing the same for another
              stranger. FindLost brings those small acts of care
              into one shared space.
            </p>

            <Link
              to="/how-it-works"
              className="about-story-link"
            >
              See how FindLost works
              <b>→</b>
            </Link>
          </div>

          <div className="about-story-art">
            <div className="about-story-circle circle-one"></div>
            <div className="about-story-circle circle-two"></div>

            <div className="about-story-object">
              <span>F</span>
            </div>

            <div className="about-story-note">
              <strong>Found.</strong>
              <span>One step closer.</span>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <span>READY WHEN YOU ARE</span>

          <h2>
            Something lost?
            <br />
            <em>Let's look for it.</em>
          </h2>

          <div className="about-cta-actions">
            <Link
              to="/report-lost"
              className="about-cta-primary"
            >
              Report a lost item
              <b>→</b>
            </Link>

            <Link
              to="/found-items"
              className="about-cta-secondary"
            >
              Browse found items
              <b>→</b>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

export default About;