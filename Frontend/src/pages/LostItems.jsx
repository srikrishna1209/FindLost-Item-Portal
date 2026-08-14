import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./LostItems.css";

function LostItems() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/items");

      const lostItems = response.data.filter(
        (item) => item.status?.toUpperCase() === "LOST"
      );

      setItems(lostItems);
    } catch (err) {
      console.error("Loading lost items failed:", err);

      if (err.response?.status === 401) {
        setError("Please log in to view lost items.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view these items.");
      } else {
        setError("Unable to load lost items.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const searchItems = async (searchText) => {
    const text = searchText.trim();

    if (!text) {
      loadItems();
      return;
    }

    try {
      setSearching(true);
      setError("");

      const response = await api.get("/api/items/search", {
        params: {
          keyword: text,
        },
      });

      const lostItems = response.data.filter(
        (item) => item.status?.toUpperCase() === "LOST"
      );

      setItems(lostItems);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Unable to search items right now.");
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await searchItems(keyword);
  };

  const handleQuickSearch = (value) => {
    setKeyword(value);
    searchItems(value);
  };

  const clearSearch = () => {
    setKeyword("");
    loadItems();
  };

 const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/uploads/")) {
    return `http://localhost:8080${imageUrl}`;
  }

  return `http://localhost:8080/uploads/${imageUrl}`;
};

  return (
    <div className="lost-items-page">

      {/* Decorative background */}
      <div className="lost-bg-shape lost-bg-shape-one"></div>
      <div className="lost-bg-shape lost-bg-shape-two"></div>
      <div className="lost-bg-shape lost-bg-shape-three"></div>

      {/* ================= HERO ================= */}

      <section className="lost-items-hero">

        <div className="lost-hero-content">

          <div className="lost-eyebrow">
            <span className="eyebrow-dot"></span>
            LOST ITEMS
          </div>

          <h1>
            Help something
            <br />
            <span>find its way home.</span>
          </h1>

          <p className="lost-hero-description">
            Browse recently reported lost items. Maybe the thing
            you're looking for is already here.
          </p>

          <div className="lost-hero-actions">

            <Link
              to="/report-lost"
              className="lost-primary-button"
            >
              <span>+</span>
              Report lost item
              <span className="button-arrow">→</span>
            </Link>

            <Link
              to="/found-items"
              className="lost-secondary-button"
            >
              Browse found items
              <span>→</span>
            </Link>

          </div>

        </div>

        {/* Hero visual */}
        <div className="lost-hero-visual">

          <div className="hero-glow"></div>

          <div className="hero-note hero-note-top">
            <span className="note-icon">📍</span>

            <div>
              <strong>Lost nearby</strong>
              <small>Someone may have seen it</small>
            </div>
          </div>

          <div className="hero-item-card">

            <div className="hero-item-image">
              <div className="hero-image-placeholder">
                <span>?</span>
              </div>

              <span className="hero-lost-badge">
                LOST
              </span>
            </div>

            <div className="hero-item-info">
              <span>RECENT REPORT</span>
              <h3>Something you're looking for?</h3>
              <p>It might be closer than you think.</p>
            </div>

          </div>

          <div className="hero-note hero-note-bottom">
            <span className="note-check">✓</span>

            <div>
              <strong>Keep looking</strong>
              <small>New reports appear regularly</small>
            </div>
          </div>

        </div>

      </section>


      {/* ================= SEARCH ================= */}

      <section className="lost-search-wrapper">

        <div className="search-heading">

          <span>SEARCH REPORTED ITEMS</span>

          <h2>
            Looking for something?
          </h2>

        </div>

        <form
          className="lost-search-box"
          onSubmit={handleSearch}
        >

          <span className="search-symbol">
            ⌕
          </span>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by item, description or location..."
          />

          {keyword && (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          <button
            type="submit"
            className="lost-search-button"
            disabled={searching}
          >
            {searching ? "Searching..." : "Search"}
          </button>

        </form>


        <div className="quick-searches">

          <span>Try searching:</span>

          <button
            type="button"
            onClick={() => handleQuickSearch("phone")}
          >
            Phone
          </button>

          <button
            type="button"
            onClick={() => handleQuickSearch("wallet")}
          >
            Wallet
          </button>

          <button
            type="button"
            onClick={() => handleQuickSearch("library")}
          >
            Library
          </button>

          <button
            type="button"
            onClick={() => handleQuickSearch("college")}
          >
            College
          </button>

        </div>

      </section>


      {/* ================= RESULTS ================= */}

      <section className="lost-results-section">

        <div className="results-top">

          <div>
            <span className="results-eyebrow">
              RECENTLY REPORTED
            </span>

            <h2>
              Lost items
            </h2>

            <p>
              Items reported by people in the community.
            </p>
          </div>

          {!loading && !error && (
            <div className="results-count">
              <strong>{items.length}</strong>
              <span>
                {items.length === 1 ? "item" : "items"}
              </span>
            </div>
          )}

        </div>


        {/* Error */}

        {error && (
          <div className="lost-message lost-error">
            <span>!</span>
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          </div>
        )}


        {/* Loading */}

        {loading && (
          <div className="lost-loading">

            <div className="loading-spinner"></div>

            <h3>Finding lost items...</h3>

            <p>
              Give us a moment while we bring the latest reports.
            </p>

          </div>
        )}


        {/* Empty */}

        {!loading && !error && items.length === 0 && (

          <div className="lost-empty">

            <div className="empty-illustration">
              <span>⌕</span>
            </div>

            <h3>
              No lost items found
            </h3>

            <p>
              We couldn't find any lost items matching your search.
              Try another word or browse all reports.
            </p>

            {keyword && (
              <button
                className="empty-button"
                onClick={clearSearch}
              >
                View all lost items
              </button>
            )}

          </div>

        )}


        {/* Item cards */}

        {!loading && !error && items.length > 0 && (

          <div className="lost-items-grid">

            {items.map((item, index) => (

              <Link
                to={`/items/${item.id}`}
                className={`lost-item-card card-accent-${index % 4}`}
                key={item.id}
              >

                <div className="lost-card-image">

                  {getImageUrl(item.imageUrl) ? (

                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.itemName}
                    />

                  ) : (

                    <div className="item-placeholder">
                      <span>
                        {item.itemName
                          ?.charAt(0)
                          ?.toUpperCase() || "?"}
                      </span>
                    </div>

                  )}

                  <span className="lost-card-badge">
                    LOST
                  </span>

                  <span className="card-view">
                    ↗
                  </span>

                </div>


                <div className="lost-card-content">

                  <div className="card-category">
                    LOST ITEM
                  </div>

                  <h3>
                    {item.itemName}
                  </h3>

                  {item.description && (
                    <p className="lost-card-description">
                      {item.description}
                    </p>
                  )}

                  <div className="lost-card-location">

                    <span className="location-icon">
                      ◉
                    </span>

                    <span>
                      {item.location || "Location not specified"}
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </section>


      {/* ================= BOTTOM MESSAGE ================= */}

      {!loading && !error && items.length > 0 && (

        <div className="lost-bottom-message">

          <span>✦</span>

          <p>
            Someone out there might know where it is.
          </p>

          <span>✦</span>

        </div>

      )}

    </div>
  );
}

export default LostItems;