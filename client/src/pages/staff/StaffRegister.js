import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import api from "../../utils/api";
import { FiUser, FiMail, FiLock, FiCamera, FiPhone } from "react-icons/fi";

const StaffRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    role: "editor",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".auth-form", { opacity: 0, y: 30, duration: 0.8 });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username || formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (formData.mobile && !/^[+]?[\d\s()-]{7,20}$/.test(formData.mobile))
      newErrors.mobile = "Enter a valid mobile number";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const formPayload = new FormData();
      formPayload.append("username", formData.username);
      formPayload.append("email", formData.email);
      formPayload.append("mobile", formData.mobile);
      formPayload.append("password", formData.password);
      formPayload.append("role", formData.role);
      if (profilePhoto) formPayload.append("profilePhoto", profilePhoto);
      const { data } = await api.post("/staff/register", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(data.message);
      setErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach((e) => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      } else {
        setErrors({
          form: err.response?.data?.message || "Registration failed",
        });
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
          Staff Registration
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Register as a staff member
        </p>

        {message && (
          <p
            style={{
              color: "#27ae60",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {message}
          </p>
        )}
        {errors.form && (
          <p
            style={{
              color: "#e74c3c",
              marginBottom: "15px",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {errors.form}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
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
              }}
            >
              {profilePhoto ? (
                <img
                  src={URL.createObjectURL(profilePhoto)}
                  alt=""
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
            Optional: Upload a profile photo
          </p>

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
                placeholder="e.g., editor_john"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>
              Choose a unique username (3-30 characters)
            </p>
            {errors.username && <p style={errorStyle}>{errors.username}</p>}
          </div>

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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>Enter your work email address</p>
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>
              Optional: Enter your mobile number with country code
            </p>
            {errors.mobile && <p style={errorStyle}>{errors.mobile}</p>}
          </div>

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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                minLength={6}
                style={inputStyle}
              />
            </div>
            <p style={helperStyle}>
              Must be at least 6 characters with uppercase, lowercase, and
              number
            </p>
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>

          <div>
            <label
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                display: "block",
                marginBottom: "5px",
              }}
            >
              Staff Role{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                (select your role)
              </span>
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              style={{ ...inputStyle, padding: "12px", cursor: "pointer" }}
            >
              <option value="editor">Editor - Can create and edit blogs</option>
              <option value="admin">
                Admin - Full access including staff management
              </option>
            </select>
            <p style={helperStyle}>
              Admin role requires approval. Editors can publish blogs after
              activation.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px" }}
          >
            Register as Staff
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
          Already registered?{" "}
          <Link
            to="/staff/login"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            Staff Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffRegister;
