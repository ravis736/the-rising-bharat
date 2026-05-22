import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiMail, FiLock, FiCamera, FiPhone } from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo(
      ".auth-form",
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
    if (!formData.username || formData.username.length < 3) {
      newErrors.username =
        "Username must be at least 3 characters (letters, numbers, and underscores only)";
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email =
        "Please enter a valid email address (e.g., name@example.com)";
    }
    if (formData.mobile && !/^[+]?[\d\s()-]{7,20}$/.test(formData.mobile)) {
      newErrors.mobile =
        "Enter a valid mobile number (e.g., +91 9876543210 or 9876543210)";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!acceptTerms) {
      newErrors.terms =
        "You must accept the Terms & Conditions and Privacy Policy";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateForm()) return;
    try {
      const formPayload = new FormData();
      formPayload.append("username", formData.username);
      formPayload.append("email", formData.email);
      formPayload.append("mobile", formData.mobile);
      formPayload.append("password", formData.password);
      if (profilePhoto) formPayload.append("profilePhoto", profilePhoto);
      await register(formPayload);
      navigate("/");
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach((e) => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      } else {
        setServerError(
          err.response?.data?.message ||
            "Registration failed. Please try again.",
        );
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
  const errorStyle = { color: "#e74c3c", fontSize: "0.8rem", marginTop: "4px" };
  const helperStyle = {
    color: "var(--text-muted)",
    fontSize: "0.75rem",
    marginTop: "2px",
  };

  return (
    <div
      className="container"
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
      }}
    >
      <div
        className="auth-form"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "40px",
          borderRadius: "16px",
          background: "var(--bg-secondary)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 700,
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Create Account
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Join The Rising Bharat community
        </p>

        {serverError && (
          <p
            style={{
              color: "#e74c3c",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {serverError}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {/* Profile Photo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <label
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {profilePhoto ? (
                <img
                  src={URL.createObjectURL(profilePhoto)}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <FiCamera size={24} style={{ color: "var(--text-muted)" }} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <p style={{ ...helperStyle, textAlign: "center" }}>
            Optional: Upload a profile photo (JPEG, PNG, WebP, etc.)
          </p>

          {/* Username */}
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
                name="username"
                placeholder="e.g., john_doe"
                value={formData.username}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>
              Choose a unique username (3-30 characters, letters, numbers,
              underscores)
            </p>
            {errors.username && <p style={errorStyle}>{errors.username}</p>}
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
                placeholder="e.g., john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>
              Enter your active email address (used for account verification and
              notifications)
            </p>
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
                placeholder="e.g., +91 9876543210"
                value={formData.mobile}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>
              Optional: Enter your mobile number with country code
            </p>
            {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
          </div>

          {/* Password */}
          <div>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>
              Must be at least 6 characters with at least 1 uppercase, 1
              lowercase, and 1 number
            </p>
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "14px",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>Re-enter your password to confirm</p>
            {errors.confirmPassword && (
              <p style={errorStyle}>{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{ accentColor: "var(--accent)", marginTop: "3px" }}
              />
              <span>
                I accept the{" "}
                <Link to="/terms-conditions" style={{ color: "var(--accent)" }}>
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" style={{ color: "var(--accent)" }}>
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && <p style={errorStyle}>{errors.terms}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "14px",
              marginTop: "5px",
            }}
          >
            Create Account
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
