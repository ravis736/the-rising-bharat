import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Breadcrumb from "../../components/Breadcrumb";
import { FiEdit2, FiEye, FiSearch } from "react-icons/fi";

const StaffBlogs = () => {
  const { staff } = useAuth();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticles();
  }, [page, search]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/articles", {
        params: { page, limit: 20, search: search || undefined },
      });
      setArticles(Array.isArray(data.articles) ? data.articles : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  if (!staff) return <Navigate to="/staff/login" />;

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 120px 80px 100px",
    gap: "10px",
    padding: "12px 16px",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
  };

  return (
    <div className="container" style={{ padding: "30px 0" }}>
      <Breadcrumb
        items={[
          { label: "Staff", to: "/staff/dashboard" },
          { label: "All Blogs" },
        ]}
      />
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "20px" }}>
        All Blogs
      </h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <FiSearch
            style={{
              position: "absolute",
              left: "12px",
              top: "12px",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search articles..."
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
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : articles.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>No articles found.</p>
      ) : (
        <>
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              background: "var(--bg-secondary)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                ...rowStyle,
                background: "var(--bg-primary)",
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span>Title</span>
              <span>Category</span>
              <span>Status</span>
              <span style={{ textAlign: "center" }}>Actions</span>
            </div>
            {articles.map((article) => (
              <div key={article._id} style={rowStyle}>
                <div>
                  <Link
                    to={`/blog/${article.slug || article._id}`}
                    style={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {article.title}
                  </Link>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: "4px",
                    }}
                  >
                    {new Date(article.createdAt).toLocaleDateString()} |{" "}
                    {article.readingTime || "?"} min read
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {article.category}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: article.isPublished ? "green" : "orange",
                  }}
                >
                  {article.isPublished ? "Published" : "Draft"}
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  <Link
                    to={`/blog/${article.slug || article._id}`}
                    style={{ color: "var(--text-secondary)" }}
                    title="View"
                  >
                    <FiEye size={16} />
                  </Link>
                  <Link
                    to={`/staff/edit-blog/${article._id}`}
                    style={{ color: "var(--accent)" }}
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "20px",
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    background:
                      p === page ? "var(--accent)" : "var(--bg-secondary)",
                    color: p === page ? "#fff" : "var(--text-primary)",
                    fontWeight: 600,
                    fontFamily: "var(--font-family)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffBlogs;
