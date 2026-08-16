import { useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Navbar.css";


function Navbar() {

  const {
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();


  const [menuOpen, setMenuOpen] =
    useState(false);


  const location = useLocation();


  const isActive = (path) =>
    location.pathname === path;


  const handleLogout = () => {
    logout();

    setMenuOpen(false);
  };


  return (
    <header className="navbar">

      <div className="navbar-inner">


        {/* =================================================
            LOGO
            ================================================= */}

        <Link
          to="/"
          className="navbar-logo"
        >
          <span className="logo-box">
            F
          </span>

          <span className="logo-find">
            Find
          </span>

          <span className="logo-lost">
            Lost
          </span>
        </Link>


        {/* =================================================
            MAIN NAVIGATION
            ================================================= */}

        <nav className="navbar-links">

          <Link
            to="/"
            className={
              isActive("/")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </Link>


          <Link
            to="/lost-items"
            className={
              isActive("/lost-items")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Lost items
          </Link>


          <Link
            to="/found-items"
            className={
              isActive("/found-items")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Found items
          </Link>


          <Link
            to="/how-it-works"
            className={
              isActive("/how-it-works")
                ? "nav-link active"
                : "nav-link"
            }
          >
            How it works
          </Link>


          <Link
            to="/contact"
            className={
              isActive("/contact")
                ? "nav-link active"
                : "nav-link"
            }
          >
            Contact
          </Link>

        </nav>


        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <div className="navbar-actions">

          {!isAuthenticated ? (

            <>

              <Link
                to="/login"
                className="login-link"
              >
                Log in
              </Link>


              <Link
                to="/register"
                className="join-button"
              >
                Join FindLost
              </Link>

            </>

          ) : (

            <div className="profile-wrapper">


              {/* ===========================================
                  ACCOUNT BUTTON
                  =========================================== */}

              <button
                type="button"
                className="profile-button"
                onClick={() =>
                  setMenuOpen(!menuOpen)
                }
              >

                <span className="profile-avatar">
                  👤
                </span>


                <span className="profile-text">
                  My Account
                </span>


                <span
                  className={
                    `profile-arrow ${
                      menuOpen ? "open" : ""
                    }`
                  }
                >
                  ▼
                </span>

              </button>


              {/* ===========================================
                  DROPDOWN
                  =========================================== */}

              {menuOpen && (

                <div className="profile-menu">


                  <div className="profile-menu-header">

                    <div className="profile-menu-avatar">
                      👤
                    </div>


                    <div>

                      <strong>
                        Welcome back!
                      </strong>

                      <span>
                        Your FindLost account
                      </span>

                    </div>

                  </div>


                  <div className="profile-menu-divider"></div>


                  {/* ======================================
                      PROFILE
                      ====================================== */}

                  <Link
                    to="/profile"
                    className="profile-menu-item"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span>👤</span>
                    Profile
                  </Link>


                  {/* ======================================
                      MY ITEMS
                      ====================================== */}

                  <Link
                    to="/my-items"
                    className="profile-menu-item"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span>📦</span>
                    My reported items
                  </Link>


                  {/* ======================================
                      SETTINGS
                      ====================================== */}

                  <Link
                    to="/settings"
                    className="profile-menu-item"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span>⚙️</span>
                    Settings
                  </Link>


                  {/* ======================================
                      ADMIN
                      ONLY FOR ADMIN USERS
                      ====================================== */}

                  {isAdmin && (

                    <>

                      <div className="profile-menu-divider"></div>


                      <Link
                        to="/admin"
                        className="profile-menu-item admin-menu-item"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                      >

                        <span>🛡️</span>

                        <span className="admin-menu-text">
                          Admin dashboard
                        </span>

                      </Link>

                    </>

                  )}


                  <div className="profile-menu-divider"></div>


                  {/* ======================================
                      LOGOUT
                      ====================================== */}

                  <button
                    type="button"
                    className="profile-menu-item logout-item"
                    onClick={handleLogout}
                  >

                    <span>↪</span>

                    Log out

                  </button>


                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </header>
  );
}


export default Navbar;