import { useState } from "react";
import { useNavigate } from "react-router-dom";

import iphoneImage from "../assets/iphone.jpg";
import idCardImage from "../assets/id-card.jpg";
import backpackImage from "../assets/backpack.jpg";
import keysImage from "../assets/keys.jpg";
import walletImage from "../assets/wallet.jpg";
import airpodsImage from "../assets/airpods.jpg";

function Home() {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");

  const handleHomeSearch = (e) => {
    e.preventDefault();

    const keyword = searchKeyword.trim();

    if (!keyword) {
      navigate("/lost-items");
      return;
    }

    navigate(
      `/lost-items?keyword=${encodeURIComponent(keyword)}`
    );
  };

  return (
    <div className="findlost-home">

      {/* ================= HERO ================= */}

      <section className="home-hero">

        <div className="hero-content">

          <div className="hero-badge">
            <span>♥</span>
            People helping people
          </div>

          <h1>
            Lost something?
            <br />
            Let's <span>find it.</span>
          </h1>

          <p className="hero-description">
            Report something you've lost, or help someone
            reunite with an item they've found.
          </p>

          <div className="hero-actions">

            <a
              href="/report-lost"
              className="lost-action"
            >
              <span>◆</span>
              I lost something
              <b>→</b>
            </a>

            <a
              href="/report-found"
              className="found-action"
            >
              <span>⌖</span>
              I found something
              <b>→</b>
            </a>

          </div>

          {/* PEOPLE */}

          <div className="community">

            <div className="community-avatars">

              <span className="avatar avatar-one">K</span>
              <span className="avatar avatar-two">A</span>
              <span className="avatar avatar-three">R</span>
              <span className="avatar avatar-four">S</span>
              <span className="avatar-plus">+</span>

            </div>

            <div className="community-text">
              <strong>500+ people</strong>
              <span>have already joined our community</span>
            </div>

          </div>

        </div>

        {/* ================= HERO IMAGE ================= */}

        <div className="hero-visual">

          <div className="yellow-circle"></div>

          <div className="dot-pattern">
            • • •<br />
            • • •<br />
            • • •
          </div>

          <div className="leaf-decoration">
            ◢
          </div>

          <div className="item-preview">

            <div className="item-image-wrapper">

              <img
                src={iphoneImage}
                alt="Found iPhone"
                className="hero-item-image"
              />

              <span className="found-pill">
                FOUND
              </span>

            </div>

            <div className="item-details">

              <h3>iPhone 14 Pro</h3>

              <p>
                Found near College Library
              </p>

              <div className="item-meta">

                <span>
                  ⌖ College Library
                </span>

                <span>
                  Today, 10:24 AM
                </span>

              </div>

            </div>

          </div>

          {/* LOCATION FLOATING CARD */}

          <div className="location-float">

            <div className="float-icon location-icon">
              📍
            </div>

            <div>
              <strong>College Library</strong>
              <small>2 min ago</small>
            </div>

          </div>

          {/* FOUND FLOATING CARD */}

          <div className="found-float">

            <div className="float-icon success-icon">
              ✓
            </div>

            <div>
              <strong>Found!</strong>
              <small>Someone may be looking for this</small>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SEARCH ================= */}

      <section className="home-search-section">

        <form
          className="home-search"
          onSubmit={handleHomeSearch}
        >

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            value={searchKeyword}
            onChange={(e) =>
              setSearchKeyword(e.target.value)
            }
            placeholder="Search for items (e.g. wallet, AirPods, college ID...)"
          />

          <button type="submit">
            Search
          </button>

        </form>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="categories-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              BROWSE CATEGORIES
            </span>

            <h2>
              What are you looking for?
            </h2>

          </div>

          <a href="/lost-items">
            Browse everything →
          </a>

        </div>

        <div className="category-grid">

          {/* ELECTRONICS */}

          <a
            href="/lost-items?category=electronics"
            className="category-card electronics"
          >

            <div className="category-image">

              <img
                src={iphoneImage}
                alt="Electronics"
              />

            </div>

            <div className="category-info">

              <h3>Electronics</h3>

              <p>
                Phones, laptops,
                <br />
                earbuds and more
              </p>

            </div>

            <span className="category-arrow">
              ↗
            </span>

          </a>

          {/* DOCUMENTS */}

          <a
            href="/lost-items?category=documents"
            className="category-card documents"
          >

            <div className="category-image">

              <img
                src={idCardImage}
                alt="IDs and Documents"
              />

            </div>

            <div className="category-info">

              <h3>IDs & Documents</h3>

              <p>
                Cards, certificates,
                <br />
                IDs and documents
              </p>

            </div>

            <span className="category-arrow">
              ↗
            </span>

          </a>

          {/* BAGS */}

          <a
            href="/lost-items?category=bags"
            className="category-card bags"
          >

            <div className="category-image">

              <img
                src={backpackImage}
                alt="Bags and Wallets"
              />

            </div>

            <div className="category-info">

              <h3>Bags & Wallets</h3>

              <p>
                Backpacks, purses,
                <br />
                wallets and more
              </p>

            </div>

            <span className="category-arrow">
              ↗
            </span>

          </a>

          {/* KEYS */}

          <a
            href="/lost-items?category=keys"
            className="category-card keys"
          >

            <div className="category-image">

              <img
                src={keysImage}
                alt="Keys"
              />

            </div>

            <div className="category-info">

              <h3>Keys & Others</h3>

              <p>
                Keys, accessories
                <br />
                and other items
              </p>

            </div>

            <span className="category-arrow">
              ↗
            </span>

          </a>

        </div>

      </section>

      {/* ================= RECENT ITEMS ================= */}

      <section className="recent-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              RECENTLY REPORTED
            </span>

            <h2>
              Latest lost & found items
            </h2>

          </div>

          <a href="/lost-items">
            View all items →
          </a>

        </div>

        <div className="recent-grid">

          <div className="recent-card">

            <div className="recent-image">

              <img
                src={iphoneImage}
                alt="iPhone"
              />

              <span className="lost-tag">
                LOST
              </span>

            </div>

            <div className="recent-info">
              <h3>iPhone 14</h3>
              <p>Near Engineering Block</p>
            </div>

          </div>

          <div className="recent-card">

            <div className="recent-image">

              <img
                src={walletImage}
                alt="Wallet"
              />

              <span className="found-tag">
                FOUND
              </span>

            </div>

            <div className="recent-info">
              <h3>Black Leather Wallet</h3>
              <p>Near College Canteen</p>
            </div>

          </div>

          <div className="recent-card">

            <div className="recent-image">

              <img
                src={airpodsImage}
                alt="AirPods"
              />

              <span className="found-tag">
                FOUND
              </span>

            </div>

            <div className="recent-info">
              <h3>AirPods</h3>
              <p>Central Library</p>
            </div>

          </div>

          <div className="recent-card">

            <div className="recent-image">

              <img
                src={backpackImage}
                alt="Backpack"
              />

              <span className="lost-tag">
                LOST
              </span>

            </div>

            <div className="recent-info">
              <h3>Blue Backpack</h3>
              <p>Near Main Gate</p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        className="how-it-works"
        id="how-it-works"
      >

        <div className="how-heading">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            Simple.
            <br />
            Human.
            <br />
            <span>Helpful.</span>
          </h2>

        </div>

        <div className="how-steps">

          <div className="how-step">

            <span>01</span>

            <h3>Report an item</h3>

            <p>
              Tell us what you've lost or found
              and where it happened.
            </p>

          </div>

          <div className="how-step">

            <span>02</span>

            <h3>Find a match</h3>

            <p>
              Browse reports and discover
              items that match yours.
            </p>

          </div>

          <div className="how-step">

            <span>03</span>

            <h3>Reconnect</h3>

            <p>
              Connect with the right person
              and return the item safely.
            </p>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="home-footer" id="contact">

        <div className="footer-logo">

          <span className="logo-box">
            F
          </span>

          <strong>
            FindLost
          </strong>

        </div>

        <p>
          Helping things find their way home.
        </p>

        <div className="footer-links">

          <a href="/about">
            About
          </a>

          <a href="/contact">
            Contact
          </a>

          <a href="/privacy">
            Privacy
          </a>

        </div>

      </footer>

    </div>
  );
}

export default Home;