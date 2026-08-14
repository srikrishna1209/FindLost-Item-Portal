import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./FoundItems.css";

function FoundItems() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // ================= LOAD FOUND ITEMS =================

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/items");

      const foundItems = response.data.filter(
        (item) => item.status?.toUpperCase() === "FOUND"
      );

      setItems(foundItems);
    } catch (err) {
      console.error("Loading found items failed:", err);

      if (err.response?.status === 401) {
        setError("Please log in to view found items.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view these items.");
      } else {
        setError("Unable to load found items.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // ================= SEARCH =================

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

      const foundItems = response.data.filter(
        (item) => item.status?.toUpperCase() === "FOUND"
      );

      setItems(foundItems);
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

  // ================= IMAGE URL =================

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

  // ================= PAGE =================

  return (
    <div className="found-items-page">

      {/* ================= HERO ================= */}

      <section className="found-items-hero">

        <div className="found-hero-content">

          <div className="found-eyebrow">
            <span className="eyebrow-dot"></span>
            FOUND ITEMS
          </div>

          <h1>
            Somewhere a Happy    
            <br />
            <span>ending begins.</span>
          </h1>

          <p className="found-hero-description">
            Browse items that have been found and reported by people
            in the community.
          </p>

          <div className="found-hero-actions">

            <Link
              to="/lost-items"
              className="found-secondary-button"
            >
              Browse lost items
              <span>→</span>
            </Link>

            <Link
              to="/report-found"
              className="found-primary-button"
            >
              <span>+</span>
              Report found item
              <span className="button-arrow">→</span>
            </Link>

          </div>

        </div>

        {/* Hero Visual */}

        <div className="found-hero-visual">

          <div className="found-hero-glow"></div>

          <div className="found-hero-note found-note-top">

            <span className="found-note-icon">✓</span>

            <div>
              <strong>Found nearby</strong>
              <small>Someone may be looking for it</small>
            </div>

          </div>

          <div className="found-hero-item-card">

            <div className="found-hero-item-image">

              <div className="found-image-placeholder">
                <span>✓</span>
              </div>

              <span className="found-badge">
                FOUND
              </span>

            </div>

            <div className="found-hero-item-info">

              <span>RECENT REPORT</span>

              <h3>
                Something someone lost?
              </h3>

              <p>
                Help it find its owner.
              </p>

            </div>

          </div>

          <div className="found-hero-note found-note-bottom">

            <span className="found-note-check">♥</span>

            <div>
              <strong>Make someone's day</strong>
              <small>Every return matters</small>
            </div>

          </div>

        </div>

      </section>


      {/* ================= SEARCH ================= */}

      <section className="found-search-wrapper">

        <div className="found-search-heading">

          <span>SEARCH FOUND ITEMS</span>

          <h2>
            Looking for something?
          </h2>

        </div>

        <form
          className="found-search-box"
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
            className="found-search-button"
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

      <section className="found-results-section">

        <div className="found-results-top">

          <div>

            <span className="found-results-eyebrow">
              RECENTLY REPORTED
            </span>

            <h2>
              Found items
            </h2>

            <p>
              Items found and reported by people in the community.
            </p>

          </div>

          {!loading && !error && (
            <div className="found-results-count">

              <strong>{items.length}</strong>

              <span>
                {items.length === 1 ? "item" : "items"}
              </span>

            </div>
          )}

        </div>


        {/* Error */}

        {error && (

          <div className="found-message found-error">

            <span>!</span>

            <div>

              <strong>Something went wrong</strong>

              <p>{error}</p>

            </div>

          </div>

        )}


        {/* Loading */}

        {loading && (

          <div className="found-loading">

            <div className="loading-spinner"></div>

            <h3>
              Finding found items...
            </h3>

            <p>
              Give us a moment while we bring the latest reports.
            </p>

          </div>

        )}


        {/* Empty */}

        {!loading && !error && items.length === 0 && (

          <div className="found-empty">

            <div className="empty-illustration">
              <span>✓</span>
            </div>

            <h3>
              No found items yet
            </h3>

            <p>
              We couldn't find any found items matching your search.
              Try another word or check back later.
            </p>

            {keyword && (

              <button
                className="empty-button"
                onClick={clearSearch}
              >
                View all found items
              </button>

            )}

          </div>

        )}


        {/* ================= ITEM CARDS ================= */}

        {!loading && !error && items.length > 0 && (

          <div className="found-items-grid">

            {items.map((item, index) => (

              <Link
                to={`/items/${item.id}`}
                className={`found-item-card card-accent-${index % 4}`}
                key={item.id}
              >

                <div className="found-card-image">

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

                  <span className="found-card-badge">
                    FOUND
                  </span>

                  <span className="card-view">
                    ↗
                  </span>

                </div>


                <div className="found-card-content">

                  <div className="card-category">
                    FOUND ITEM
                  </div>

                  <h3>
                    {item.itemName}
                  </h3>

                  {item.description && (

                    <p className="found-card-description">
                      {item.description}
                    </p>

                  )}

                  <div className="found-card-location">

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

        <div className="found-bottom-message">

          <span>✦</span>

          <p>
            Someone might be looking for one of these.
          </p>

          <span>✦</span>

        </div>

      )}

    </div>
  );
}

export default FoundItems;