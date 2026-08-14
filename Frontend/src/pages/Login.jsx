import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      // Login successful
      navigate("/");

    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT BRAND SECTION */}

        <div className="auth-brand">

          <div className="auth-decoration-one"></div>
          <div className="auth-decoration-two"></div>

          <div className="auth-brand-logo">

            <div className="auth-logo-box">
              F
            </div>

            <span>
              Find<span style={{ color: "#e86f55" }}>
                Lost
              </span>
            </span>

          </div>


          <div className="auth-brand-content">

            <div className="eyebrow">
              ♥ People helping people
            </div>

            <h2>
              Welcome back.
              <br />
              <span>Let's find it.</span>
            </h2>

            <p>
              Sign in to report lost items, discover found belongings,
              and help reunite people with what matters to them.
            </p>

            <div className="auth-visual">

              <div className="auth-visual-text">
                Someone found it!
              </div>

            </div>

          </div>

        </div>


        {/* FORM SECTION */}

        <div className="auth-form-section">

          <div className="auth-form-wrapper">

            <div className="auth-form-header">

              <h1>
                Welcome <span>Back</span>
              </h1>

              <p>
                Sign in to continue to your FindLost account.
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}

              <div className="auth-field">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="auth-field">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

              </div>


              {/* OPTIONS */}

              <div className="auth-options">

                <label className="remember-me">

                  <input type="checkbox" />

                  Remember me

                </label>

                <a
                  href="#"
                  className="forgot-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>

              </div>


              {/* ERROR */}

              {error && (
                <div className="auth-message auth-error">
                  {error}
                </div>
              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign in to FindLost"}
              </button>

            </form>


            {/* REGISTER LINK */}

            <div className="auth-switch">

              Don't have an account?{" "}

              <Link to="/register">
                Create one
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;