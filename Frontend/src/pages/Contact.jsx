import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Contact.css";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });


  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSubmitted(false);

    setError("");
  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }


    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }


    if (!formData.message.trim()) {
      setError("Please enter your message.");
      return;
    }


    try {

      setLoading(true);


      await api.post(
        "/api/contact",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }
      );


      setSubmitted(true);

    } catch (err) {

      console.error(
        "Contact submission failed:",
        err
      );


      if (err.response?.data?.message) {

        setError(
          err.response.data.message
        );

      } else if (err.response?.status === 400) {

        setError(
          "Please check your details and try again."
        );

      } else if (err.response?.status === 403) {

        setError(
          "You are not allowed to send this message."
        );

      } else {

        setError(
          "We couldn't send your message right now. Please try again."
        );
      }

    } finally {

      setLoading(false);
    }
  };


  const resetForm = () => {

    setSubmitted(false);

    setError("");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };


  return (
    <div className="contact-page">

      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div className="contact-shape contact-shape-one"></div>

      <div className="contact-shape contact-shape-two"></div>

      <div className="contact-shape contact-shape-three"></div>


      <div className="contact-wrapper">

        {/* ===================================================
            HERO
            =================================================== */}

        <section className="contact-hero">

          <div className="contact-hero-copy">

            <div className="contact-eyebrow">
              <span></span>
              CONTACT FINDLOST
            </div>


            <h1>
              Have something
              <br />
              <em>to say?</em>
            </h1>


            <p>
              Questions, feedback, or something that needs
              attention? Tell us what is on your mind.
            </p>

          </div>


          <div className="contact-hero-card">

            <div className="contact-hero-icon">
              ✦
            </div>

            <span>
              WE'RE LISTENING
            </span>

            <h2>
              Every message
              <br />
              matters.
            </h2>

            <p>
              A thoughtful message helps us understand
              what could make FindLost better for everyone.
            </p>

          </div>

        </section>


        {/* ===================================================
            CONTACT CONTENT
            =================================================== */}

        <section className="contact-content">

          {/* FORM */}

          <div className="contact-form-card">

            <div className="contact-card-heading">

              <span>
                SEND A MESSAGE
              </span>

              <h2>
                How can we help?
              </h2>

              <p>
                Share the details and we'll have everything
                we need to understand your message.
              </p>

            </div>


            {submitted ? (

              <div className="contact-success">

                <div className="contact-success-icon">
                  ✓
                </div>

                <span>
                  MESSAGE RECEIVED
                </span>

                <h3>
                  Thanks for reaching out.
                </h3>

                <p>
                  Your message has been received by FindLost.
                  Thank you for taking the time to get in touch.
                </p>

                <button
                  type="button"
                  onClick={resetForm}
                >
                  Send another message
                </button>

              </div>

            ) : (

              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >

                <div className="contact-form-row">

                  <div className="contact-field">

                    <label htmlFor="contact-name">
                      Your name
                    </label>

                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      disabled={loading}
                    />

                  </div>


                  <div className="contact-field">

                    <label htmlFor="contact-email">
                      Email address
                    </label>

                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      disabled={loading}
                    />

                  </div>

                </div>


                <div className="contact-field">

                  <label htmlFor="contact-subject">
                    Subject
                  </label>

                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    disabled={loading}
                  />

                </div>


                <div className="contact-field">

                  <label htmlFor="contact-message">
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what happened, what you need help with, or what you would like to suggest..."
                    rows="7"
                    disabled={loading}
                  />

                </div>


                {error && (
                  <div className="contact-form-error">
                    {error}
                  </div>
                )}


                <button
                  type="submit"
                  className="contact-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Sending..."
                    : "Send message"}

                  <span>
                    {loading ? "..." : "→"}
                  </span>

                </button>

              </form>

            )}

          </div>


          {/* SIDE INFORMATION */}

          <aside className="contact-side">

            <div className="contact-side-card">

              <span>
                BEFORE YOU WRITE
              </span>

              <h3>
                A few things
                <br />
                that may help.
              </h3>


              <div className="contact-tip">

                <div>
                  01
                </div>

                <p>
                  For a lost or found item, the item page
                  usually has the quickest path to the
                  information you need.
                </p>

              </div>


              <div className="contact-tip">

                <div>
                  02
                </div>

                <p>
                  For a claim, check your My Claims page
                  to see the latest status of your request.
                </p>

              </div>


              <div className="contact-tip">

                <div>
                  03
                </div>

                <p>
                  For something you've reported, My
                  Reported Items keeps your reports together.
                </p>

              </div>

            </div>


            <div className="contact-side-card contact-help-card">

              <div className="contact-help-icon">
                ?
              </div>

              <span>
                LOOKING FOR SOMETHING?
              </span>

              <h3>
                Maybe the answer
                <br />
                is already here.
              </h3>

              <Link to="/how-it-works">
                See how FindLost works
                <span>→</span>
              </Link>

            </div>

          </aside>

        </section>


        {/* ===================================================
            FINAL MESSAGE
            =================================================== */}

        <section className="contact-bottom">

          <span>
            FINDLOST
          </span>

          <h2>
            Better together,
            <br />
            one item at a time.
          </h2>

        </section>

      </div>

    </div>
  );
}

export default Contact;