import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ReportItem.css";

function ReportLost() {
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

      // This page always creates a LOST item
      data.append("status", "LOST");

      if (image) {
        data.append("image", image);
      }

      await api.post("/api/items", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        "Your lost item has been reported successfully."
      );

      setFormData({
        itemName: "",
        description: "",
        location: "",
      });

      setImage(null);
      setPreview("");

      setTimeout(() => {
        navigate("/lost-items");
      }, 1800);

    } catch (err) {
      console.error("Report lost item error:", err);

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
    <div className="report-page">

      {/* Decorative shapes */}
      <div className="report-shape report-shape-one"></div>
      <div className="report-shape report-shape-two"></div>
      <div className="report-dots">
        • • •
        <br />
        • • •
        <br />
        • • •
      </div>


      <div className="report-wrapper">

        {/* ================= HEADER ================= */}

        <div className="report-intro">

          <div className="report-badge">
            <span>✦</span>
            LOST ITEM REPORT
          </div>

          <h1>
            Report a lost item.
            <br />
            <span>Let's help bring it home.</span>
          </h1>

          <p>
            Tell us a few details about what you lost.
            A clear description can make all the difference.
          </p>

        </div>


        {/* ================= MAIN CONTENT ================= */}

        <div className="report-layout">

          {/* FORM */}

          <div className="report-card">

            <div className="report-card-heading">

              <div>
                <span className="mini-label">
                  ITEM DETAILS
                </span>

                <h2>
                  Tell us what happened
                </h2>
              </div>

              <div className="report-number">
                01
              </div>

            </div>


            <form
              className="report-form"
              onSubmit={handleSubmit}
            >

              {/* ITEM NAME */}

              <div className="report-field">

                <label htmlFor="itemName">
                  What did you lose?
                  <span>*</span>
                </label>

                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  value={formData.itemName}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 14 Pro"
                  required
                />

              </div>


              {/* DESCRIPTION */}

              <div className="report-field">

                <div className="field-heading">

                  <label htmlFor="description">
                    Describe your item
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
                  placeholder="Tell us about the color, model, case, marks, stickers or anything else that could help identify it..."
                  rows="5"
                  required
                />

              </div>


              {/* LOCATION */}

              <div className="report-field">

                <label htmlFor="location">
                  Where did you last see it?
                  <span>*</span>
                </label>

                <div className="location-input">

                  <span>⌖</span>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. College Library"
                    required
                  />

                </div>

              </div>


              {/* IMAGE */}

              <div className="report-field">

                <div className="field-heading">

                  <label>
                    Add a photo
                  </label>

                  <small>
                    Optional, but recommended
                  </small>

                </div>


                <label
                  htmlFor="itemImage"
                  className={`upload-area ${
                    preview ? "has-image" : ""
                  }`}
                >

                  {preview ? (

                    <div className="image-preview">

                      <img
                        src={preview}
                        alt="Selected item"
                      />

                      <div className="change-photo">
                        Change photo
                      </div>

                    </div>

                  ) : (

                    <div className="upload-content">

                      <div className="upload-icon">
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
                  id="itemImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />

              </div>


              {/* STATUS DISPLAY */}

              <div className="status-preview">

                <div className="status-icon">
                  !
                </div>

                <div>
                  <strong>
                    You're reporting a lost item
                  </strong>

                  <p>
                    We'll mark this report as
                    <span> LOST</span> automatically.
                  </p>
                </div>

              </div>


              {/* MESSAGES */}

              {error && (
                <div className="report-message report-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="report-message report-success">
                  ✓ {success}
                </div>
              )}


              {/* SUBMIT */}

              <button
                type="submit"
                className="report-submit"
                disabled={loading}
              >

                {loading
                  ? "Reporting item..."
                  : "Report Lost Item"}

                {!loading && (
                  <span>→</span>
                )}

              </button>

            </form>

          </div>


          {/* ================= RIGHT VISUAL ================= */}

          <div className="report-side">

            <div className="side-card">

              <div className="side-card-top">

                <span>
                  LOST
                </span>

                <div className="side-star">
                  ✦
                </div>

              </div>


              <div className="side-illustration">

                <div className="circle-back"></div>

                <div className="phone-shape">

                  <div className="phone-camera"></div>

                  <div className="phone-screen">
                    <span>?</span>
                  </div>

                </div>

              </div>


              <div className="side-message">

                <h3>
                  Every detail helps.
                </h3>

                <p>
                  Someone nearby might have seen your
                  item — give them enough information to
                  recognize it.
                </p>

              </div>

            </div>


            <div className="side-note">

              <div className="note-check">
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


        {/* ================= BOTTOM MESSAGE ================= */}

        <div className="report-footer-message">
          <span>✦</span>
          Lost things deserve another chance.
          <span>✦</span>
        </div>

      </div>

    </div>
  );
}

export default ReportLost;