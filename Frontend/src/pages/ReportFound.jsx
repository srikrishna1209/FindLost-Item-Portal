import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ReportFound.css";

function ReportFound() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      return;
    }

    setImage(selectedImage);
    setPreview(URL.createObjectURL(selectedImage));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.itemName.trim() ||
      !formData.description.trim() ||
      !formData.location.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("itemName", formData.itemName);
      data.append("description", formData.description);
      data.append("location", formData.location);

      // This page always creates a FOUND item
      data.append("status", "FOUND");

      if (image) {
        data.append("image", image);
      }

      await api.post("/api/items", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        "Your found item has been reported successfully."
      );

      setFormData({
        itemName: "",
        description: "",
        location: "",
      });

      setImage(null);
      setPreview("");

      setTimeout(() => {
        navigate("/found-items");
      }, 1800);

    } catch (err) {
      console.error("Report found item error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to report an item.");
      } else {
        setError(
          "Unable to report the item right now. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="found-report-page">

      {/* =================================================
          DECORATIVE BACKGROUND
          ================================================= */}

      <div className="found-report-shape found-report-shape-one"></div>

      <div className="found-report-shape found-report-shape-two"></div>

      <div className="found-report-dots">
        • • •
        <br />
        • • •
        <br />
        • • •
      </div>


      <div className="found-report-wrapper">

        {/* =================================================
            INTRO
            ================================================= */}

        <div className="found-report-intro">

          <div className="found-report-badge">
            <span>✦</span>
            FOUND ITEM REPORT
          </div>

          <h1>
            Report a found item.
            <br />
            <span>Let's help bring it home.</span>
          </h1>

          <p>
            Found something that belongs to someone else?
            Share a few details and help it find its owner.
          </p>

        </div>


        {/* =================================================
            MAIN LAYOUT
            ================================================= */}

        <div className="found-report-layout">

          {/* =================================================
              FORM CARD
              ================================================= */}

          <div className="found-report-card">

            <div className="found-report-card-heading">

              <div>

                <span className="found-mini-label">
                  ITEM DETAILS
                </span>

                <h2>
                  Tell us what you found
                </h2>

              </div>

              <div className="found-report-number">
                01
              </div>

            </div>


            <form
              className="found-report-form"
              onSubmit={handleSubmit}
            >

              {/* ITEM NAME */}

              <div className="found-report-field">

                <label htmlFor="itemName">
                  What did you find?
                  <span>*</span>
                </label>

                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  value={formData.itemName}
                  onChange={handleChange}
                  placeholder="e.g. Dell laptop"
                  required
                  disabled={loading}
                />

              </div>


              {/* DESCRIPTION */}

              <div className="found-report-field">

                <div className="found-field-heading">

                  <label htmlFor="description">
                    Describe the item
                    <span>*</span>
                  </label>

                  <small>
                    Be as specific as possible
                  </small>

                </div>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about the color, brand, model, case, marks, stickers or anything else that could help identify it..."
                  rows="5"
                  required
                  disabled={loading}
                />

              </div>


              {/* LOCATION */}

              <div className="found-report-field">

                <label htmlFor="location">
                  Where did you find it?
                  <span>*</span>
                </label>

                <div className="found-location-input">

                  <span>⌖</span>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. College Library"
                    required
                    disabled={loading}
                  />

                </div>

              </div>


              {/* IMAGE */}

              <div className="found-report-field">

                <div className="found-field-heading">

                  <label>
                    Add a photo
                  </label>

                  <small>
                    Optional, but recommended
                  </small>

                </div>


                <label
                  htmlFor="foundItemImage"
                  className={`found-upload-area ${
                    preview ? "has-image" : ""
                  }`}
                >

                  {preview ? (

                    <div className="found-image-preview">

                      <img
                        src={preview}
                        alt="Selected found item"
                      />

                      <div className="found-change-photo">
                        Change photo
                      </div>

                    </div>

                  ) : (

                    <div className="found-upload-content">

                      <div className="found-upload-icon">
                        +
                      </div>

                      <strong>
                        Add a clear photo
                      </strong>

                      <span>
                        Click to choose an image
                      </span>

                    </div>

                  )}

                </label>


                <input
                  id="foundItemImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  hidden
                />

              </div>


              {/* STATUS */}

              <div className="found-status-preview">

                <div className="found-status-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    You're reporting a found item
                  </strong>

                  <p>
                    We'll mark this report as
                    <span> FOUND</span> automatically.
                  </p>

                </div>

              </div>


              {/* MESSAGES */}

              {error && (
                <div className="found-report-message found-report-error">
                  {error}
                </div>
              )}


              {success && (
                <div className="found-report-message found-report-success">
                  ✓ {success}
                </div>
              )}


              {/* SUBMIT */}

              <button
                type="submit"
                className="found-report-submit"
                disabled={loading}
              >

                {loading
                  ? "Reporting item..."
                  : "Report Found Item"}

                {!loading && (
                  <span>→</span>
                )}

              </button>

            </form>

          </div>


          {/* =================================================
              RIGHT SIDE VISUAL
              ================================================= */}

          <div className="found-report-side">

            <div className="found-side-card">

              <div className="found-side-card-top">

                <span>
                  FOUND
                </span>

                <div className="found-side-star">
                  ✦
                </div>

              </div>


              <div className="found-side-illustration">

                <div className="found-circle-back"></div>

                <div className="found-phone-shape">

                  <div className="found-phone-camera"></div>

                  <div className="found-phone-screen">
                    ✓
                  </div>

                </div>

              </div>


              <div className="found-side-message">

                <h3>
                  Every detail helps.
                </h3>

                <p>
                  Someone nearby might be looking for
                  this item — give them enough information
                  to recognize it.
                </p>

              </div>

            </div>


            <div className="found-side-note">

              <div className="found-note-check">
                ✓
              </div>

              <div>

                <strong>
                  Helpful tip
                </strong>

                <p>
                  Add the item's color, brand, model
                  and any unique marks.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            FOOTER MESSAGE
            ================================================= */}

        <div className="found-report-footer-message">

          <span>✦</span>

          Found things deserve another chance to go home.

          <span>✦</span>

        </div>

      </div>

    </div>
  );
}

export default ReportFound;