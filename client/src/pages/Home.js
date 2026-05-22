import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../utils/api";
import Subscription from "../components/Subscription";
import LazyImage from "../components/LazyImage";
import { ArticleJsonLd, BreadcrumbJsonLd } from "../components/JsonLd";

gsap.registerPlugin(ScrollTrigger);

const categoryLabels = {
  "government-sector": "Government Sector",
  "business-finance": "Business & Finance",
  "world-news": "World News",
  "crime-law": "Crime & Law",
  environment: "Environment",
  "social-issues": "Social Issues",
  "latest-updates": "Latest Updates",
  technology: "Technology",
  "ai-news": "AI News",
  gaming: "Gaming",
  lifestyle: "Lifestyle",
  entertainment: "Entertainment",
  "health-fitness": "Health & Fitness",
  "religion-culture": "Religion & Culture",
  education: "Education",
  "jobs-career": "Jobs & Career",
  sports: "Sports",
  science: "Science",
  automobile: "Automobile",
  "facts-knowledge": "Facts & Knowledge",
  "guest-posting": "Guest Posting",
};

const categoryColors = {
  "government-sector": "#2c3e50",
  "business-finance": "#27ae60",
  "world-news": "#2980b9",
  "crime-law": "#c0392b",
  environment: "#1abc9c",
  "social-issues": "#8e44ad",
  "latest-updates": "#e67e22",
  technology: "#3498db",
  "ai-news": "#9b59b6",
  gaming: "#e74c3c",
  lifestyle: "#f39c12",
  entertainment: "#ff6b6b",
  "health-fitness": "#2ecc71",
  "religion-culture": "#d35400",
  education: "#1abc9c",
  "jobs-career": "#3498db",
  sports: "#27ae60",
  science: "#7f8c8d",
  automobile: "#e74c3c",
  "facts-knowledge": "#f39c12",
  "guest-posting": "#9b59b6",
};

const Home = ({ lang }) => {
  const [heroArticles, setHeroArticles] = useState([]);
  const [groupedArticles, setGroupedArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && heroArticles.length > 0) {
      gsap.fromTo(
        ".hero-section",
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [loading, heroArticles]);

  const fetchData = async () => {
    try {
      const [heroRes, groupedRes] = await Promise.all([
        api.get("/articles/hero"),
        api.get("/articles/grouped"),
      ]);
      setHeroArticles(heroRes.data || []);
      setGroupedArticles(groupedRes.data || {});
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  if (loading) return null;

  const mainArticle = heroArticles[0];
  const sideArticles = heroArticles.slice(1, 4);

  const breadcrumbItems = [{ label: "Home" }];

  return (
    <div className="container">
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="hero-section"
        style={{
          minHeight: "100vh",
          display: "flex",
          gap: "20px",
          marginBottom: "50px",
        }}
      >
        {mainArticle && (
          <Link
            to={`/blog/${mainArticle.slug || mainArticle._id}`}
            style={{
              flex: "4",
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "var(--shadow)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ flex: 1, overflow: "hidden" }}>
              <LazyImage
                src={
                  mainArticle.featuredImage ||
                  `https://picsum.photos/seed/${mainArticle._id}/800/600`
                }
                alt={mainArticle.title}
                style={{ width: "100%", height: "100%", minHeight: "400px" }}
              />
            </div>
            <div style={{ padding: "20px", background: "var(--bg-secondary)" }}>
              <span
                style={{
                  background: categoryColors[mainArticle.category] || "#333",
                  color: "#fff",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  display: "inline-block",
                  marginBottom: "10px",
                }}
              >
                {categoryLabels[mainArticle.category] || mainArticle.category}
              </span>
              <h2
                style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3 }}
              >
                {mainArticle.title}
              </h2>
              {mainArticle.tagline && (
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginTop: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  {mainArticle.tagline}
                </p>
              )}
            </div>
          </Link>
        )}

        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {sideArticles.map((article, idx) => (
            <div key={article._id}>
              <Link
                to={`/blog/${article.slug || article._id}`}
                className="card"
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <LazyImage
                  src={
                    article.featuredImage ||
                    `https://picsum.photos/seed/${article._id}/400/300`
                  }
                  alt={article.title}
                  style={{ width: "100%", height: "120px" }}
                />
                <div style={{ padding: "10px" }}>
                  <span
                    style={{
                      background: categoryColors[article.category] || "#333",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      display: "inline-block",
                      marginBottom: "6px",
                    }}
                  >
                    {categoryLabels[article.category] || article.category}
                  </span>
                  <h3
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Top Subscription */}
      <div>
        <Subscription lang={lang} />
      </div>

      {/* Category Sections */}
      {Object.entries(groupedArticles).map(([category, articles], idx) => {
        if (!articles.length) return null;
        const largeArticle = articles[0];
        const smallArticles = articles.slice(1, 7);

        return (
          <section key={category} style={{ marginBottom: "50px" }}>
            <h2
              className="section-title"
              style={{ color: categoryColors[category] || "#333" }}
            >
              {categoryLabels[category] || category}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: "15px",
              }}
            >
              {largeArticle && (
                <div style={{ gridRow: "span 2" }}>
                  <Link
                    to={`/blog/${largeArticle._id}`}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <LazyImage
                      src={
                        largeArticle.featuredImage ||
                        `https://picsum.photos/seed/${largeArticle._id}/600/400`
                      }
                      alt={largeArticle.title}
                      style={{ width: "100%", height: "300px" }}
                    />
                    <div style={{ padding: "16px" }}>
                      <h3
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          marginBottom: "8px",
                        }}
                      >
                        {largeArticle.title}
                      </h3>
                      {largeArticle.tagline && (
                        <p
                          style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.85rem",
                          }}
                        >
                          {largeArticle.tagline}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              )}

              {smallArticles.map((article, i) => (
                <div key={article._id}>
                  <Link
                    to={`/blog/${article.slug || article._id}`}
                    className="card"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <LazyImage
                      src={
                        article.featuredImage ||
                        `https://picsum.photos/seed/${article._id}/300/200`
                      }
                      alt={article.title}
                      style={{ width: "100%", height: "140px" }}
                    />
                    <div style={{ padding: "10px" }}>
                      <h4
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.title}
                      </h4>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Bottom Subscription */}
      <div>
        <Subscription lang={lang} />
      </div>
    </div>
  );
};

export default Home;
