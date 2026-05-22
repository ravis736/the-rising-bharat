import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import api from "../../utils/api";
import { FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.from(".auth-form", { opacity: 1, y: 30, duration: 0.8 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/forgot-password", { email });
      setMessage(data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset email");
      setMessage("");
    }
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
          Forgot Password
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Enter your email to receive a reset link
        </p>

        {message && (
          <p
            style={{
              color: "green",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
        {error && (
          <p
            style={{ color: "red", marginBottom: "15px", textAlign: "center" }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
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
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "14px" }}
          >
            Send Reset Link
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link
            to="/login"
            style={{
              color: "var(--accent)",
              fontSize: "0.9rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
