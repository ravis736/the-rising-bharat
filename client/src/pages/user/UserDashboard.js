import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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
  FiBookmark,
  FiBell,
  FiSettings,
  FiShield,
  FiPhone,
} from "react-icons/fi";

const UserDashboard = () => {
  const { user, token, fetchProfile } = useAuth();
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
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        confirmPassword: "",
      });
    }
    gsap.from(".dashboard-content", { opacity: 0, y: 30, duration: 0.8 });
  }, [user]);

  if (!token) return <Navigate to="/login" />;

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
      await api.put("/users/profile", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Profile updated successfully");
      fetchProfile();
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "saved", label: "Saved Posts", icon: FiBookmark },
    { id: "settings", label: "Settings", icon: FiSettings },
    { id: "privacy", label: "Privacy", icon: FiShield },
  ];

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-family)",
  };

  return (
    <div className="container" style={{ padding: "30px 0" }}>
      <Breadcrumb items={[{ label: "Dashboard" }]} />
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background:
                  activeTab === tab.id
                    ? "var(--accent)"
                    : "var(--bg-secondary)",
                color: activeTab === tab.id ? "#fff" : "var(--text-primary)",
                fontFamily: "var(--font-family)",
                fontWeight: 500,
                fontSize: "0.95rem",
                transition: "var(--transition)",
              }}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
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
                Profile Settings
              </h2>
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
                      position: "relative",
                    }}
                  >
                    <img
                      src={
                        profilePhoto
                          ? URL.createObjectURL(profilePhoto)
                          : getImageUrl(user?.profilePhoto)
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
                  style={inputStyle}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email"
                  style={inputStyle}
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
                    placeholder="Mobile Number (e.g., +91 9876543210)"
                    style={{ ...inputStyle, paddingLeft: "36px" }}
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
                  placeholder="New Password (leave blank to keep current)"
                  style={inputStyle}
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
                  placeholder="Confirm New Password"
                  style={inputStyle}
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

          {activeTab === "saved" && (
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
                Saved Posts
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Your saved posts will appear here.
              </p>
            </div>
          )}

          {activeTab === "settings" && (
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
                Notification Settings
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ accentColor: "var(--accent)" }}
                  />{" "}
                  Email Notifications
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ accentColor: "var(--accent)" }}
                  />{" "}
                  Push Notifications
                </label>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
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
                Privacy Settings
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    style={{ accentColor: "var(--accent)" }}
                  />{" "}
                  Show my profile to others
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ accentColor: "var(--accent)" }}
                  />{" "}
                  Show my saved posts
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
