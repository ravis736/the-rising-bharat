import React, { useState, useEffect } from "react";
import gsap from "gsap";
import api from "../../utils/api";
import Breadcrumb from "../../components/Breadcrumb";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiBriefcase,
} from "react-icons/fi";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const animation = gsap.fromTo(
      ".contact-content",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
    );
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        "Please enter a valid email address (e.g., name@example.com)";
    }
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[+]?[\d\s()-]{7,20}$/.test(formData.mobile)) {
      newErrors.mobile =
        "Enter a valid mobile number (e.g., +91 9876543210 or 9876543210)";
    }
    if (!formData.subject || formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }
    if (!formData.message || formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!validateForm()) return;
    try {
      await api.post("/interactions/contact", { ...formData, type: activeTab });
      setStatus("Message sent successfully! We will get back to you soon.");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach((e) => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      } else {
        setStatus("Error sending message. Please try again.");
      }
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 12px 12px 42px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-family)",
    fontSize: "0.95rem",
  };
  const textareaStyle = {
    width: "100%",
    padding: "12px 12px 12px 42px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-family)",
    fontSize: "0.95rem",
    resize: "vertical",
  };
  const errorStyle = { color: "#e74c3c", fontSize: "0.8rem", marginTop: "4px" };
  const helperStyle = {
    color: "var(--text-muted)",
    fontSize: "0.75rem",
    marginTop: "2px",
  };

  const generalHelpers = {
    name: "Enter your full name so we know how to address you",
    email: "We will use this to respond to your enquiry",
    mobile:
      "Your mobile number with country code (required for verification and quick response)",
    subject: "Brief summary of your question or feedback",
    message: "Describe your enquiry in detail so we can assist you better",
  };

  const businessHelpers = {
    name: "Enter your full name and designation (if any)",
    email: "Preferably your official/work email address",
    mobile:
      "Your contact number with country code (required, we may contact for business discussion)",
    subject: "Nature of business collaboration you are interested in",
    message:
      "Describe your proposal, partnership ideas, or business requirements in detail",
  };

  const helpers = activeTab === "general" ? generalHelpers : businessHelpers;

  const generalPlaceholders = {
    name: "e.g., John Doe",
    email: "e.g., john@example.com",
    mobile: "e.g., +91 9876543210",
    subject: "e.g., Question about your article on...",
    message: "Write your message here...",
  };

  const businessPlaceholders = {
    name: "e.g., John Doe, Marketing Manager",
    email: "e.g., john@company.com",
    mobile: "e.g., +91 9876543210",
    subject: "e.g., Partnership / Advertising / Sponsorship Proposal",
    message: "Describe your business proposal in detail...",
  };

  const placeholders =
    activeTab === "general" ? generalPlaceholders : businessPlaceholders;

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Contact Us" }]} />
      <div
        className="contact-content"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 0" }}
      >
        <h1 className="section-title">Contact Us</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "30px" }}>
          Have a question, suggestion, or business inquiry? We'd love to hear
          from you.
        </p>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0",
            marginBottom: "30px",
            borderBottom: "2px solid var(--border-color)",
          }}
        >
          {["general", "business"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setErrors({});
                setStatus("");
              }}
              style={{
                padding: "12px 24px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem",
                color:
                  activeTab === tab ? "var(--accent)" : "var(--text-secondary)",
                borderBottom:
                  activeTab === tab
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                marginBottom: "-2px",
                fontFamily: "var(--font-family)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {tab === "general" ? (
                <>
                  <FiMessageSquare /> General Enquiry
                </>
              ) : (
                <>
                  <FiBriefcase /> Business Collaboration
                </>
              )}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {/* Name */}
          <div>
            <div style={{ position: "relative" }}>
              <FiUser
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                name="name"
                placeholder={placeholders.name}
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>{helpers.name}</p>
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <div style={{ position: "relative" }}>
              <FiMail
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="email"
                name="email"
                placeholder={placeholders.email}
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>{helpers.email}</p>
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div>
            <div style={{ position: "relative" }}>
              <FiPhone
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="tel"
                name="mobile"
                placeholder={placeholders.mobile}
                value={formData.mobile}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>{helpers.mobile}</p>
            {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
          </div>

          {/* Subject */}
          <div>
            <div style={{ position: "relative" }}>
              <FiMessageSquare
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                name="subject"
                placeholder={placeholders.subject}
                value={formData.subject}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>{helpers.subject}</p>
            {errors.subject && <p style={errorStyle}>{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <div style={{ position: "relative" }}>
              <FiMessageSquare
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <textarea
                name="message"
                placeholder={placeholders.message}
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                style={textareaStyle}
              />
            </div>
            <p style={helperStyle}>{helpers.message}</p>
            {errors.message && <p style={errorStyle}>{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ alignSelf: "flex-start" }}
          >
            Send Message
          </button>
        </form>
        {status && (
          <p
            style={{
              marginTop: "15px",
              color: status.includes("successfully") ? "#27ae60" : "#e74c3c",
            }}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default Contact;
