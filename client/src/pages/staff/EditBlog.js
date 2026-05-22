import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import NewBlog from "./NewBlog";

const EditBlog = () => {
  const { id } = useParams();
  const { staff } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data } = await api.get(`/articles/${id}`);
      setArticle(data);
    } catch (err) {
      console.error("Error fetching article:", err);
    }
    setLoading(false);
  };

  if (!staff) return <Navigate to="/staff/login" />;
  if (loading)
    return (
      <div className="container">
        <p>Loading article...</p>
      </div>
    );
  if (!article)
    return (
      <div className="container">
        <p>Article not found</p>
      </div>
    );

  return <NewBlog editArticle={article} />;
};

export default EditBlog;
