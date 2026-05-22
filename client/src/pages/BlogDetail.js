import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import LazyImage from "../components/LazyImage";
import SEO from "../components/SEO";
import { ArticleJsonLd, BreadcrumbJsonLd } from "../components/JsonLd";
import { sanitizeHtml } from "../utils/sanitize";
import {
  FiThumbsUp,
  FiThumbsDown,
  FiMessageSquare,
  FiShare2,
  FiClock,
  FiUser,
  FiCalendar,
} from "react-icons/fi";

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

const BlogDetail = ({ lang }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [activeReply, setActiveReply] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article && !loading) {
      gsap.fromTo(
        ".blog-content",
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
    }
  }, [article, loading]);

  const fetchArticle = async () => {
    try {
      const { data } = await api.get(`/articles/${id}`);
      setArticle(data);
      const [relatedRes, commentsRes] = await Promise.all([
        api.get(`/articles/related/${data._id}`),
        api.get(`/interactions/comments/${data._id}`),
      ]);
      setRelated(relatedRes.data || []);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchReplies = async (commentId) => {
    try {
      const { data } = await api.get(`/interactions/replies/${commentId}`);
      setReplies((prev) => ({ ...prev, [commentId]: data }));
    } catch {}
  };

  useEffect(() => {
    comments.forEach((c) => fetchReplies(c._id));
  }, [comments]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    try {
      const { data } = await api.post(`/interactions/comments/${article._id}`, {
        text: commentText,
      });
      setComments((prev) => [data, ...prev]);
      setCommentText("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleReply = async (commentId) => {
    if (!user) return alert("Please login to reply");
    try {
      const { data } = await api.post(
        `/interactions/replies/${article._id}/${commentId}`,
        { text: replyText[commentId] },
      );
      setReplies((prev) => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), data],
      }));
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setActiveReply(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleLike = async (type, itemId) => {
    if (!user) return alert("Please login");
    try {
      const { data } = await api.post(`/interactions/like/${type}/${itemId}`);
      if (type === "comment") {
        setComments((prev) =>
          prev.map((c) =>
            c._id === itemId
              ? { ...c, likes: data.likes, dislikes: data.dislikes }
              : c,
          ),
        );
      }
    } catch {}
  };

  const handleDislike = async (type, itemId) => {
    if (!user) return alert("Please login");
    try {
      const { data } = await api.post(
        `/interactions/dislike/${type}/${itemId}`,
      );
      if (type === "comment") {
        setComments((prev) =>
          prev.map((c) =>
            c._id === itemId
              ? { ...c, likes: data.likes, dislikes: data.dislikes }
              : c,
          ),
        );
      }
    } catch {}
  };

  const shareBlog = (platform) => {
    const url = window.location.href;
    const text = article?.title || "";
    const urls = {
      facebook: `https://facebook.com/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  if (loading) return null;
  if (!article)
    return (
      <div className="container">
        <p>Article not found</p>
      </div>
    );

  const breadcrumbItems = [
    {
      label: categoryLabels[article.category] || article.category,
      path: `/category/${article.category}`,
    },
    { label: article.title },
  ];

  return (
    <div className="container">
      <SEO
        title={article.title}
        description={article.metaDescription || article.tagline}
        image={article.featuredImage}
        article={article}
      />
      <ArticleJsonLd article={article} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />

      <article className="blog-content">
        <Link
          to={`/category/${article.category}`}
          style={{
            color: "var(--accent)",
            fontWeight: 600,
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {categoryLabels[article.category] || article.category}
        </Link>

        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            lineHeight: 1.2,
            margin: "15px 0",
          }}
        >
          {article.title}
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            marginBottom: "25px",
            alignItems: "center",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FiUser /> TRB
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FiCalendar />{" "}
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FiClock /> {article.readingTime} min read
          </span>
        </div>

        <LazyImage
          src={article.featuredImage || ""}
          alt={article.imageAltText || article.title}
          style={{
            width: "100%",
            maxHeight: "500px",
            borderRadius: "16px",
            marginBottom: "10px",
          }}
        />
        {article.imageSourceLink && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginBottom: "25px",
            }}
          >
            <a
              href={article.imageSourceLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", fontWeight: 500 }}
            >
              Image Source
            </a>
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            <FiShare2 /> Share:
          </span>
          {["facebook", "twitter", "linkedin", "whatsapp"].map((platform) => (
            <button
              key={platform}
              onClick={() => shareBlog(platform)}
              style={{
                padding: "8px 16px",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                background: "var(--bg-secondary)",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
                fontFamily: "var(--font-family)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}
        </div>

        {/* Clickable Tags */}
        {article.tags?.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "25px",
            }}
          >
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "var(--border-color)",
                  fontSize: "0.8rem",
                  transition: "var(--transition)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "var(--border-color)")
                }
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {article.tagline && (
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--text-secondary)",
              fontStyle: "italic",
              marginBottom: "25px",
              borderLeft: "3px solid var(--accent)",
              paddingLeft: "15px",
            }}
          >
            {article.tagline}
          </p>
        )}

        <div
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: "var(--text-primary)",
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />
      </article>

      {/* Comments Section */}
      <section className="comment-section" style={{ marginTop: "50px" }}>
        <h2 className="section-title">Comments ({comments.length})</h2>
        {user ? (
          <form
            onSubmit={handleComment}
            style={{ display: "flex", gap: "10px", marginBottom: "30px" }}
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              required
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-family)",
                resize: "vertical",
                minHeight: "60px",
              }}
            />
            <button type="submit" className="btn btn-primary">
              <FiMessageSquare /> Comment
            </button>
          </form>
        ) : (
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
            <Link to="/login" style={{ color: "var(--accent)" }}>
              Login
            </Link>{" "}
            to leave a comment.
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                padding: "15px",
                borderRadius: "12px",
                background: "var(--bg-secondary)",
                boxShadow: "var(--shadow)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <strong>{comment.user?.username || "Anonymous"}</strong>
                <span
                  style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
                >
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ marginBottom: "10px" }}>{comment.text}</p>
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                  fontSize: "0.85rem",
                }}
              >
                <button
                  onClick={() => handleLike("comment", comment._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <FiThumbsUp /> {comment.likes?.length || 0}
                </button>
                <button
                  onClick={() => handleDislike("comment", comment._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <FiThumbsDown /> {comment.dislikes?.length || 0}
                </button>
                <button
                  onClick={() =>
                    setActiveReply(
                      activeReply === comment._id ? null : comment._id,
                    )
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--accent)",
                  }}
                >
                  Reply ({replies[comment._id]?.length || 0})
                </button>
              </div>
              {activeReply === comment._id && (
                <div
                  style={{ marginTop: "10px", display: "flex", gap: "10px" }}
                >
                  <input
                    value={replyText[comment._id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [comment._id]: e.target.value,
                      }))
                    }
                    placeholder="Write a reply..."
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-family)",
                    }}
                  />
                  <button
                    onClick={() => handleReply(comment._id)}
                    className="btn btn-outline"
                    style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  >
                    Reply
                  </button>
                </div>
              )}
              {replies[comment._id]?.length > 0 && (
                <div
                  style={{
                    marginTop: "10px",
                    marginLeft: "20px",
                    padding: "10px",
                    borderLeft: "2px solid var(--border-color)",
                  }}
                >
                  {replies[comment._id].map((reply) => (
                    <div key={reply._id} style={{ marginBottom: "10px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <strong style={{ fontSize: "0.85rem" }}>
                          {reply.user?.username || "Anonymous"}
                        </strong>
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.9rem" }}>{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Stories */}
      {related.length > 0 && (
        <section style={{ marginTop: "50px" }}>
          <h2 className="section-title">Related Stories</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {related.map((rel) => (
              <div key={rel._id}>
                <Link
                  to={`/blog/${rel.slug || rel._id}`}
                  className="card"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <LazyImage
                    src={rel.featuredImage || ""}
                    alt={rel.title}
                    style={{ width: "100%", height: "180px" }}
                  />
                  <div className="card-body">
                    <h3 className="card-title">{rel.title}</h3>
                    <p className="card-tagline">{rel.tagline}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQs */}
      {article.faqs?.length > 0 && (
        <section style={{ marginTop: "50px", marginBottom: "50px" }}>
          <h2 className="section-title">FAQs</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {article.faqs.map((faq, idx) => (
              <details
                key={idx}
                style={{
                  padding: "15px 20px",
                  borderRadius: "12px",
                  background: "var(--bg-secondary)",
                  boxShadow: "var(--shadow)",
                  cursor: "pointer",
                }}
              >
                <summary style={{ fontWeight: 600, fontSize: "1rem" }}>
                  {faq.question}
                </summary>
                <p
                  style={{
                    marginTop: "10px",
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                  }}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;
