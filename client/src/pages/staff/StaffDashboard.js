import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import getImageUrl from "../../utils/imageUrl";
import Breadcrumb from "../../components/Breadcrumb";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCamera,
  FiFileText,
  FiUsers,
  FiList,
  FiPhone,
} from "react-icons/fi";

const StaffDashboard = () => {
  const { staff, fetchProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (staff) {
      setFormData({
        username: staff.username || "",
        email: staff.email || "",
        mobile: staff.mobile || "",
        password: "",
        confirmPassword: "",
      });
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-content",
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
    });

    return () => ctx.revert();
  }, [staff]);

  if (!staff) return <Navigate to="/staff/login" />;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setMessage("Passwords do not match");
    }
    try {
      const formPayload = new FormData();
      formPayload.append("username", formData.username);
      formPayload.append("email", formData.email);
      formPayload.append("mobile", formData.mobile);
      if (formData.password) formPayload.append("password", formData.password);
      if (profilePhoto) formPayload.append("profilePhoto", profilePhoto);
      await api.put("/staff/profile", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="container" style={{ padding: "30px 0" }}>
      <Breadcrumb items={[{ label: "Staff Dashboard" }]} />
      {message && (
        <p
          style={{
            color: message.includes("success") ? "green" : "red",
            marginBottom: "15px",
          }}
        >
          {message}
        </p>
      )}

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <div
          style={{
            width: "250px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background:
                activeTab === "profile"
                  ? "var(--accent)"
                  : "var(--bg-secondary)",
              color: activeTab === "profile" ? "#fff" : "var(--text-primary)",
              fontFamily: "var(--font-family)",
              fontWeight: 500,
              fontSize: "0.95rem",
              transition: "var(--transition)",
            }}
          >
            <FiUser /> Profile
          </button>
          <Link
            to="/staff/new-blog"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            <FiFileText /> New Blog
          </Link>
          <Link
            to="/staff/blogs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            <FiList /> All Blogs
          </Link>
          {staff.role === "admin" && (
            <Link
              to="/staff/list"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            >
              <FiUsers /> Staff List
            </Link>
          )}
        </div>

        <div
          className="dashboard-content"
          style={{ flex: 1, minWidth: "300px" }}
        >
          {activeTab === "profile" && (
            <div
              style={{
                padding: "25px",
                borderRadius: "12px",
                background: "var(--bg-secondary)",
                boxShadow: "var(--shadow)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "20px",
                }}
              >
                Staff Profile
              </h2>
              <p
                style={{ color: "var(--text-secondary)", marginBottom: "15px" }}
              >
                Role:{" "}
                <strong style={{ textTransform: "capitalize" }}>
                  {staff.role}
                </strong>{" "}
                | Status:{" "}
                <strong style={{ color: staff.isActive ? "green" : "red" }}>
                  {staff.isActive ? "Active" : "Inactive"}
                </strong>
              </p>
              <form
                onSubmit={handleUpdate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  maxWidth: "500px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      background: "var(--border-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        profilePhoto
                          ? URL.createObjectURL(profilePhoto)
                          : getImageUrl(staff?.profilePhoto)
                      }
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <FiCamera
                      size={20}
                      style={{
                        color: "var(--text-muted)",
                        position: "absolute",
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePhoto(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </label>
                  <span
                    style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
                  >
                    Click to change photo
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Username"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-family)",
                  }}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-family)",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <FiPhone
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "12px",
                      color: "var(--text-muted)",
                    }}
                  />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                    placeholder="Mobile Number"
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 36px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-family)",
                    }}
                  />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="New Password"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-family)",
                  }}
                />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm Password"
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-family)",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ alignSelf: "flex-start" }}
                >
                  Update Profile
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
