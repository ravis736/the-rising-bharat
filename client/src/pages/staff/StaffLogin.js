import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".auth-form", { opacity: 1, y: 30, duration: 0.8 });
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validateForm()) return;
    try {
      await login(email, password, "staff");
      navigate("/staff/dashboard");
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
            "Invalid email or password. Please try again.",
        );
      }
    }
  };

  const errorStyle = { color: "#e74c3c", fontSize: "0.8rem", marginTop: "4px" };

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
          maxWidth: "450px",
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
          Staff Login
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Access your staff account
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
          <div>
            <div style={{ position: "relative" }}>
              <FiMail
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="email"
                placeholder="e.g., editor@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                required
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 44px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-family)",
                }}
              />
            </div>
            {errors.email && <p style={errorStyle}>{errors.email}</p>}
          </div>

          <div>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                required
                style={{
                  width: "100%",
                  padding: "14px 44px 14px 44px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-family)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p style={errorStyle}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px" }}
          >
            Login
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
          <Link to="/staff/forgot-password" style={{ color: "var(--accent)" }}>
            Forgot Password?
          </Link>
        </div>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Link
            to="/login"
            style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
          >
            User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
