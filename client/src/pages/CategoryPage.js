import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import api from "../utils/api";
import Breadcrumb from "../components/Breadcrumb";
import LazyImage from "../components/LazyImage";
import { BreadcrumbJsonLd } from "../components/JsonLd";
import { FiClock, FiUser, FiCalendar } from "react-icons/fi";

const categoryLabels = {
  "public-government-affairs": "Public & Government Affairs",
  "government-sector": "Government Sector",
  "business-finance": "Business & Finance",
  "world-news": "World News",
  "crime-law": "Crime & Law",
  environment: "Environment",
  "social-issues": "Social Issues",
  "latest-updates": "Latest Updates",
  "digital-future-tech": "Digital & Future Tech",
  technology: "Technology",
  "ai-news": "AI News",
  gaming: "Gaming",
  "lifestyle-culture": "Lifestyle & Culture",
  lifestyle: "Lifestyle",
  entertainment: "Entertainment",
  "health-fitness": "Health & Fitness",
  "religion-culture": "Religion & Culture",
  "education-careers": "Education & Careers",
  education: "Education",
  "jobs-career": "Jobs & Career",
  "sports-knowledge": "Sports & Knowledge",
  sports: "Sports",
  science: "Science",
  automobile: "Automobile",
  "facts-knowledge": "Facts & Knowledge",
  community: "Community",
  "guest-posting": "Guest Posting",
};

const parentCategories = {
  "public-government-affairs": [
    "government-sector",
    "business-finance",
    "world-news",
    "crime-law",
    "environment",
    "social-issues",
    "latest-updates",
  ],
  "digital-future-tech": ["technology", "ai-news", "gaming"],
  "lifestyle-culture": [
    "lifestyle",
    "entertainment",
    "health-fitness",
    "religion-culture",
  ],
  "education-careers": ["education", "jobs-career"],
  "sports-knowledge": ["sports", "science", "automobile", "facts-knowledge"],
  community: ["guest-posting"],
};

const CategoryPage = ({ lang }) => {
  const { category } = useParams();
  const [groupedArticles, setGroupedArticles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setGroupedArticles({});
    setLoading(true);
    fetchCategoryData();
  }, [category]);

  const fetchCategoryData = async () => {
    const subs = parentCategories[category];
    if (!subs) {
      // Normal sub-category page
      try {
        const { data } = await api.get(
          `/articles/category/${category}?page=1&limit=50`,
        );
        setGroupedArticles({
          [categoryLabels[category] || category]: data.articles || [],
        });
      } catch {
        setGroupedArticles({});
      }
      setLoading(false);
      return;
    }

    // Parent category: fetch articles for each sub-category
    try {
      const results = await Promise.all(
        subs.map(async (sub) => {
          try {
            const { data } = await api.get(
              `/articles/category/${sub}?page=1&limit=12`,
            );
            return {
              sub,
              label: categoryLabels[sub] || sub,
              articles: data.articles || [],
            };
          } catch {
            return { sub, label: categoryLabels[sub] || sub, articles: [] };
          }
        }),
      );
      const grouped = {};
      results.forEach((r) => {
        grouped[r.label] = r.articles;
      });
      setGroupedArticles(grouped);
    } catch {
      setGroupedArticles({});
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".article-card",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all",
        },
      );
    }
  }, [groupedArticles, loading]);

  const label = categoryLabels[category] || category;
  const breadcrumbItems = [{ label }];
  const isParent = !!parentCategories[category];

  return (
    <div className="container">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="section-title">{label}</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {Object.entries(groupedArticles)
            .filter(([, articles]) => articles.length > 0)
            .map(([sectionLabel, articles]) => (
              <div key={sectionLabel} style={{ marginBottom: "50px" }}>
                {isParent && (
                  <h2
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      marginBottom: "20px",
                      paddingBottom: "10px",
                      borderBottom: "2px solid var(--accent)",
                    }}
                  >
                    <Link
                      to={`/category/${Object.entries(categoryLabels).find(([, v]) => v === sectionLabel)?.[0] || ""}`}
                      style={{ color: "var(--text-primary)" }}
                    >
                      {sectionLabel}
                    </Link>
                  </h2>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {articles.map((article) => (
                    <div key={article._id} className="article-card">
                      <Link
                        to={`/blog/${article.slug || article._id}`}
                        className="card"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <LazyImage
                          src={
                            article.featuredImage ||
                            `https://picsum.photos/seed/${article._id}/400/250`
                          }
                          alt={article.title}
                          style={{ width: "100%", height: "200px" }}
                        />
                        <div
                          className="card-body"
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <h3 className="card-title">{article.title}</h3>
                          {article.tagline && (
                            <p
                              className="card-tagline"
                              style={{ marginBottom: "12px" }}
                            >
                              {article.tagline}
                            </p>
                          )}
                          <div
                            style={{
                              marginTop: "auto",
                              display: "flex",
                              gap: "15px",
                              color: "var(--text-muted)",
                              fontSize: "0.8rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FiUser /> TRB
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FiCalendar />{" "}
                              {new Date(
                                article.publishedAt,
                              ).toLocaleDateString()}
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <FiClock /> {article.readingTime} min
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
