import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Breadcrumb from "../../components/Breadcrumb";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";

const StaffList = () => {
  const { staff } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (staff?.role === "admin") fetchStaff();
    gsap.from(".content", { opacity: 1, y: 30, duration: 0.8 });
  }, [staff]);

  const fetchStaff = async () => {
    try {
      const { data } = await api.get("/staff/list");
      setStaffList(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/staff/toggle-status/${id}`);
      setStaffList((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: data.isActive } : s)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  if (!staff || staff.role !== "admin")
    return <Navigate to="/staff/dashboard" />;

  return (
    <div className="container" style={{ padding: "30px 0" }}>
      <Breadcrumb items={[{ label: "Staff List" }]} />
      <h1 className="section-title">Staff Management</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="content" style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "var(--bg-secondary)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "var(--shadow)",
            }}
          >
            <thead>
              <tr style={{ background: "var(--border-color)" }}>
                <th
                  style={{
                    padding: "14px 18px",
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  Username
                </th>
                <th
                  style={{
                    padding: "14px 18px",
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "14px 18px",
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "14px 18px",
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "14px 18px",
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr
                  key={s._id}
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                  <td style={{ padding: "12px 18px" }}>{s.username}</td>
                  <td style={{ padding: "12px 18px" }}>{s.email}</td>
                  <td
                    style={{
                      padding: "12px 18px",
                      textTransform: "capitalize",
                    }}
                  >
                    {s.role}
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <span
                      style={{
                        color: s.isActive ? "green" : "red",
                        fontWeight: 600,
                      }}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <button
                      onClick={() => toggleStatus(s._id)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: s.isActive ? "#e74c3c" : "#27ae60",
                        color: "#fff",
                        fontFamily: "var(--font-family)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {s.isActive ? <FiToggleLeft /> : <FiToggleRight />}
                      {s.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffList;
