import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Breadcrumb from '../components/Breadcrumb';
import LazyImage from '../components/LazyImage';
import { FiClock, FiUser, FiCalendar } from 'react-icons/fi';

const TagPage = () => {
  const { tag } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticles();
  }, [tag]);

  const fetchArticles = async () => {
    try {
      const { data } = await api.get(`/articles/tag/${tag}`);
      setArticles(data.articles || []);
    } catch { }
    setLoading(false);
  };

  return (
    <div className="container">
      <Breadcrumb items={[{ label: `Tag: ${tag}` }]} />
      <h1 className="section-title">Articles tagged: #{tag}</h1>

      {loading ? <p>Loading...</p> : articles.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No articles found with this tag.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {articles.map(article => (
            <Link key={article._id} to={`/blog/${article.slug || article._id}`} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <LazyImage src={article.featuredImage || ''} alt={article.title} style={{ width: '100%', height: '200px' }} />
              <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="card-title">{article.title}</h3>
                {article.tagline && <p className="card-tagline" style={{ marginBottom: '12px' }}>{article.tagline}</p>}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiUser /> TRB</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiCalendar /> {new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiClock /> {article.readingTime} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagPage;
