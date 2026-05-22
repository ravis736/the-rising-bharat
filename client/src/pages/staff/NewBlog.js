import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import gsap from "gsap";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Breadcrumb from "../../components/Breadcrumb";

const categories = {
  "Public & Government Affairs": [
    "government-sector",
    "business-finance",
    "world-news",
    "crime-law",
    "environment",
    "social-issues",
    "latest-updates",
  ],
  "Digital & Future Tech": ["technology", "ai-news", "gaming"],
  "Lifestyle & Culture": [
    "lifestyle",
    "entertainment",
    "health-fitness",
    "religion-culture",
  ],
  "Education & Careers": ["education", "jobs-career"],
  "Sports & Knowledge": ["sports", "science", "automobile", "facts-knowledge"],
  Community: ["guest-posting"],
};

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

const mainCategoryMap = {
  "government-sector": "public-government-affairs",
  "business-finance": "public-government-affairs",
  "world-news": "public-government-affairs",
  "crime-law": "public-government-affairs",
  environment: "public-government-affairs",
  "social-issues": "public-government-affairs",
  "latest-updates": "public-government-affairs",
  technology: "digital-future-tech",
  "ai-news": "digital-future-tech",
  gaming: "digital-future-tech",
  lifestyle: "lifestyle-culture",
  entertainment: "lifestyle-culture",
  "health-fitness": "lifestyle-culture",
  "religion-culture": "lifestyle-culture",
  education: "education-careers",
  "jobs-career": "education-careers",
  sports: "sports-knowledge",
  science: "sports-knowledge",
  automobile: "sports-knowledge",
  "facts-knowledge": "sports-knowledge",
  "guest-posting": "community",
};

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [showUrlInput, setShowUrlInput] = useState(null);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    if (editorRef.current && !value) {
      editorRef.current.innerHTML = "";
    }
  }, []);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current.focus();
    if (onChange) onChange(editorRef.current.innerHTML);
  };

  const insertImage = () => {
    if (urlInput) {
      exec("insertImage", urlInput);
      setUrlInput("");
      setShowUrlInput(null);
    }
  };

  const insertVideo = () => {
    if (urlInput) {
      const isYoutube = urlInput.match(/(?:youtube\.com|youtu\.be)/);
      const isSocialMedia = urlInput.match(
        /(?:twitter\.com|x\.com|facebook\.com|instagram\.com)/,
      );
      let embedHtml = "";
      if (isYoutube) {
        const videoId = urlInput.match(/(?:v=|youtu\.be\/)([\w-]+)/);
        if (videoId) {
          embedHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId[1]}" frameborder="0" allowfullscreen></iframe>`;
        }
      } else if (isSocialMedia) {
        embedHtml = `<blockquote class="social-embed"><a href="${urlInput}" target="_blank">View on Social Media</a></blockquote>`;
      } else {
        embedHtml = `<video controls style="max-width:100%"><source src="${urlInput}"></video>`;
      }
      if (embedHtml) {
        document.execCommand("insertHTML", false, embedHtml);
        if (onChange) onChange(editorRef.current.innerHTML);
      }
      setUrlInput("");
      setShowUrlInput(null);
    }
  };

  const toolbarStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "8px",
    borderBottom: "1px solid var(--border-color)",
    background: "var(--bg-secondary)",
    borderRadius: "8px 8px 0 0",
  };
  const btnStyle = {
    padding: "6px 10px",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    background: "var(--bg-primary)",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "var(--text-primary)",
    fontFamily: "var(--font-family)",
  };

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div style={toolbarStyle}>
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("italic")}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("underline")}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("strikeThrough")}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <span
          style={{
            width: "1px",
            background: "var(--border-color)",
            margin: "0 4px",
          }}
        />
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("insertUnorderedList")}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("insertOrderedList")}
          title="Numbered List"
        >
          1. List
        </button>
        <span
          style={{
            width: "1px",
            background: "var(--border-color)",
            margin: "0 4px",
          }}
        />
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("formatBlock", "<h2>")}
          title="Heading"
        >
          H2
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("formatBlock", "<h3>")}
          title="Subheading"
        >
          H3
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("formatBlock", "<p>")}
          title="Paragraph"
        >
          P
        </button>
        <span
          style={{
            width: "1px",
            background: "var(--border-color)",
            margin: "0 4px",
          }}
        />
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("createLink", prompt("Enter URL:"))}
          title="Insert Link"
        >
          🔗 Link
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => setShowUrlInput("image")}
          title="Insert Image"
        >
          🖼️ Image
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => setShowUrlInput("video")}
          title="Insert Video/Embed"
        >
          ▶️ Video
        </button>
        <button
          type="button"
          style={btnStyle}
          onClick={() => exec("removeFormat")}
          title="Clear Formatting"
        >
          ✕ Clear
        </button>
      </div>
      {showUrlInput && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "8px",
            borderBottom: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
          }}
        >
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={
              showUrlInput === "image" ? "Image URL..." : "Video/Social URL..."
            }
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-family)",
            }}
          />
          <button
            type="button"
            style={btnStyle}
            onClick={showUrlInput === "image" ? insertImage : insertVideo}
          >
            Insert
          </button>
          <button
            type="button"
            style={{ ...btnStyle, background: "#e74c3c", color: "#fff" }}
            onClick={() => setShowUrlInput(null)}
          >
            Cancel
          </button>
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          minHeight: "300px",
          padding: "16px",
          outline: "none",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-family)",
          fontSize: "1rem",
          lineHeight: 1.6,
        }}
        onInput={(e) => onChange && onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder="Write your blog content here..."
      />
    </div>
  );
};

const NewBlog = ({ editArticle }) => {
  const { staff } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pageTitle: "",
    metaDescription: "",
    metaKeywords: "",
    category: "technology",
    title: "",
    slug: "",
    tagline: "",
    tags: "",
    content: "",
    imageAltText: "",
    imageSourceLink: "",
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.fromTo(
      ".blog-form",
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

    if (editArticle) {
      setFormData({
        pageTitle: editArticle.pageTitle || "",
        metaDescription: editArticle.metaDescription || "",
        metaKeywords: editArticle.metaKeywords || "",
        category: editArticle.category || "technology",
        title: editArticle.title || "",
        slug: editArticle.slug || "",
        tagline: editArticle.tagline || "",
        tags: editArticle.tags ? editArticle.tags.join(", ") : "",
        content: editArticle.content || "",
        imageAltText: editArticle.imageAltText || "",
        imageSourceLink: editArticle.imageSourceLink || "",
      });
      setFaqs(
        editArticle.faqs?.length > 0
          ? editArticle.faqs
          : [{ question: "", answer: "" }],
      );
    }
  }, [editArticle]);

  if (!staff) return <Navigate to="/staff/login" />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const generateSlug = (title) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleFaqChange = (idx, field, value) => {
    const updated = [...faqs];
    updated[idx][field] = value;
    setFaqs(updated);
  };

  const addFaq = () =>
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  const removeFaq = (idx) =>
    setFaqs((prev) => prev.filter((_, i) => i !== idx));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5)
      newErrors.title = "Blog title must be at least 5 characters";
    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug))
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    if (!formData.content || formData.content.length < 50)
      newErrors.content = "Blog content must be at least 50 characters";
    if (!formData.category) newErrors.category = "Please select a category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formPayload.append(key, value),
      );
      if (featuredImage) formPayload.append("featuredImage", featuredImage);
      formPayload.append(
        "faqs",
        JSON.stringify(faqs.filter((f) => f.question && f.answer)),
      );
      formPayload.append(
        "mainCategory",
        mainCategoryMap[formData.category] || "",
      );

      if (editArticle) {
        await api.put(`/articles/${editArticle._id}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Blog updated successfully!");
      } else {
        await api.post("/articles", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Blog published successfully!");
        setFormData({
          pageTitle: "",
          metaDescription: "",
          metaKeywords: "",
          category: "technology",
          title: "",
          slug: "",
          tagline: "",
          tags: "",
          content: "",
          imageAltText: "",
          imageSourceLink: "",
        });
        setFeaturedImage(null);
        setFaqs([{ question: "", answer: "" }]);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error publishing blog");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-family)",
    fontSize: "0.95rem",
  };
  const labelStyle = {
    fontSize: "0.9rem",
    fontWeight: 600,
    marginBottom: "5px",
    display: "block",
  };
  const errorStyle = { color: "#e74c3c", fontSize: "0.8rem", marginTop: "4px" };
  const helperStyle = {
    color: "var(--text-muted)",
    fontSize: "0.75rem",
    marginTop: "2px",
    marginBottom: "2px",
  };

  return (
    <div className="container" style={{ padding: "30px 0" }}>
      <Breadcrumb items={[{ label: editArticle ? "Edit Blog" : "New Blog" }]} />
      <h1 className="section-title">
        {editArticle ? "Edit Blog" : "Create New Blog"}
      </h1>
      {message && (
        <p
          style={{
            color: message.includes("success") ? "#27ae60" : "#e74c3c",
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "8px",
            background: message.includes("success") ? "#d4edda" : "#f8d7da",
          }}
        >
          {message}
        </p>
      )}

      <form
        className="blog-form"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          maxWidth: "900px",
        }}
      >
        {/* Page Title */}
        <div>
          <label style={labelStyle}>
            Page Title <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <input
            type="text"
            name="pageTitle"
            value={formData.pageTitle}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g., Government Announces New Digital Initiative - The Rising Bharat"
          />
          <p style={helperStyle}>
            This appears in the browser tab and as the main SEO title. Should be
            descriptive (5-200 characters).
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <label style={labelStyle}>Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows="3"
            style={inputStyle}
            placeholder="Brief summary of the blog for search engines (150-160 characters recommended)"
          />
          <p style={helperStyle}>
            A concise description that appears in search engine results. Keep it
            under 160 characters.
          </p>
        </div>

        {/* Meta Keywords */}
        <div>
          <label style={labelStyle}>Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g., government, digital india, technology, policy"
          />
          <p style={helperStyle}>
            Comma-separated keywords that help search engines understand your
            content.
          </p>
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>
            Blog Category <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">-- Select a category --</option>
            {Object.entries(categories).map(([group, cats]) => (
              <optgroup key={group} label={group}>
                {cats.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p style={helperStyle}>
            Choose the most relevant category. This determines where your blog
            appears on the website.
          </p>
          {errors.category && <p style={errorStyle}>{errors.category}</p>}
        </div>

        {/* Blog Title */}
        <div>
          <label style={labelStyle}>
            Blog Title <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => {
              handleChange(e);
              if (!editArticle) generateSlug(e.target.value);
            }}
            required
            style={inputStyle}
            placeholder="e.g., New Government Digital Initiative to Transform Public Services"
          />
          <p style={helperStyle}>
            The main headline of your blog. Should be clear, engaging, and
            informative (5-200 characters).
          </p>
          {errors.title && <p style={errorStyle}>{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label style={labelStyle}>Blog Slug (URL)</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              /blog/
            </span>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              style={inputStyle}
              placeholder="new-government-digital-initiative"
            />
            <button
              type="button"
              onClick={() => generateSlug(formData.title)}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                cursor: "pointer",
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-family)",
              }}
            >
              Generate
            </button>
          </div>
          <p style={helperStyle}>
            The URL-friendly version of the title. Auto-generated from the
            title. Use only lowercase letters, numbers, and hyphens.
          </p>
          {errors.slug && <p style={errorStyle}>{errors.slug}</p>}
        </div>

        {/* Tagline */}
        <div>
          <label style={labelStyle}>Tagline / Subtitle</label>
          <textarea
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            rows="2"
            style={inputStyle}
            placeholder="A short, catchy line that summarizes the blog (appears below the title)"
          />
          <p style={helperStyle}>
            An optional subtitle that appears below the main title on category
            pages and in search results.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g., technology, digital india, innovation, government"
          />
          <p style={helperStyle}>
            Comma-separated tags for filtering and categorization. Users can
            click tags to find related blogs.
          </p>
        </div>

        {/* Blog Content (Rich Text Editor) */}
        <div>
          <label style={labelStyle}>
            Blog Content <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(html) =>
              setFormData((prev) => ({ ...prev, content: html }))
            }
          />
          <p style={helperStyle}>
            Use the toolbar to format text. You can insert images, videos,
            YouTube embeds, and social media posts. Minimum 50 characters.
          </p>
          {errors.content && <p style={errorStyle}>{errors.content}</p>}
        </div>

        {/* Featured Image */}
        <div>
          <label style={labelStyle}>Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFeaturedImage(e.target.files[0])}
            style={inputStyle}
          />
          <p style={helperStyle}>
            Upload the main image for your blog. Accepted formats: JPEG, PNG,
            GIF, WebP, SVG, BMP, TIFF, HEIC. Max size: 10MB.
          </p>
          {featuredImage && (
            <p
              style={{
                color: "#27ae60",
                fontSize: "0.85rem",
                marginTop: "4px",
              }}
            >
              Selected: {featuredImage.name}
            </p>
          )}
        </div>

        {/* Image Alt Text */}
        <div>
          <label style={labelStyle}>Image Alt Text</label>
          <input
            type="text"
            name="imageAltText"
            value={formData.imageAltText}
            onChange={handleChange}
            style={inputStyle}
            placeholder="e.g., Government officials inaugurating new digital services platform"
          />
          <p style={helperStyle}>
            Descriptive text for the featured image (important for accessibility
            and SEO).
          </p>
        </div>

        {/* Image Source Link */}
        <div>
          <label style={labelStyle}>Image Source Link</label>
          <input
            type="url"
            name="imageSourceLink"
            value={formData.imageSourceLink}
            onChange={handleChange}
            style={inputStyle}
            placeholder="https://example.com/photo-credit"
          />
          <p style={helperStyle}>
            If the image is from an external source, provide the original URL
            for credit.
          </p>
        </div>

        {/* FAQs */}
        <div>
          <label style={labelStyle}>Blog FAQs</label>
          <p style={helperStyle}>
            Add frequently asked questions related to this blog. These appear at
            the bottom of the article.
          </p>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="e.g., What is this initiative about?"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(idx, "question", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="e.g., This initiative aims to..."
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(idx, "answer", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
              {faqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  style={{
                    padding: "8px 12px",
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFaq}
            className="btn btn-outline"
            style={{
              marginTop: "5px",
              padding: "8px 16px",
              fontSize: "0.85rem",
            }}
          >
            + Add FAQ
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            alignSelf: "flex-start",
            padding: "14px 36px",
            fontSize: "1rem",
          }}
        >
          {editArticle ? "Update Blog" : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default NewBlog;
