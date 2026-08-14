import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/users/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "USER",
        }
      );

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Registration failed. Please check your details and try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">

      <div className="auth-container">

        {/* LEFT BRAND SECTION */}
        <div className="auth-brand">

          <div className="auth-decoration-one"></div>
          <div className="auth-decoration-two"></div>

          <div className="auth-brand-logo">
            <div className="auth-logo-box">F</div>

            <span>
              Find<span style={{ color: "#e86f55" }}>Lost</span>
            </span>
          </div>

          <div className="auth-brand-content">

            <div className="eyebrow">
              ♥ People helping people
            </div>

            <h2>
              Lost something?
              <br />
              <span>We're here.</span>
            </h2>

            <p>
              Join a community where lost belongings find their way
              back home — and where a small act of kindness can make
              someone's day.
            </p>

            <div className="auth-visual">
              <div className="auth-visual-text">
                Found near campus
              </div>
            </div>

          </div>

        </div>


        {/* FORM SECTION */}
        <div className="auth-form-section">

          <div className="auth-form-wrapper">

            <div className="auth-form-header">

              <h1>
                Create <span>Account</span>
              </h1>

              <p>
                Join FindLost and help make lost things easier to find.
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              <div className="auth-field">

                <label htmlFor="name">
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="auth-field">

                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="auth-field">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="auth-field">

                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

              </div>


              {error && (
                <div className="auth-message auth-error">
                  {error}
                </div>
              )}


              {success && (
                <div className="auth-message auth-success">
                  {success}
                </div>
              )}


              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create my FindLost account"}
              </button>

            </form>


            <div className="auth-switch">

              Already have an account?{" "}

              <Link to="/login">
                Sign in
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;