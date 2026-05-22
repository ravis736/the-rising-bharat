import React from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose, lang }) => {
  const categories = [
    { label: 'Public & Govt Affairs', path: '/category/public-government-affairs' },
    { label: 'Government Sector', path: '/category/government-sector' },
    { label: 'Business & Finance', path: '/category/business-finance' },
    { label: 'World News', path: '/category/world-news' },
    { label: 'Crime & Law', path: '/category/crime-law' },
    { label: 'Environment', path: '/category/environment' },
    { label: 'Social Issues', path: '/category/social-issues' },
    { label: 'Latest Updates', path: '/category/latest-updates' },
    { label: 'Digital & Future Tech', path: '/category/digital-future-tech' },
    { label: 'Technology', path: '/category/technology' },
    { label: 'AI News', path: '/category/ai-news' },
    { label: 'Gaming', path: '/category/gaming' },
    { label: 'Lifestyle & Culture', path: '/category/lifestyle-culture' },
    { label: 'Lifestyle', path: '/category/lifestyle' },
    { label: 'Entertainment', path: '/category/entertainment' },
    { label: 'Health & Fitness', path: '/category/health-fitness' },
    { label: 'Religion & Culture', path: '/category/religion-culture' },
    { label: 'Education & Careers', path: '/category/education-careers' },
    { label: 'Education', path: '/category/education' },
    { label: 'Jobs & Career', path: '/category/jobs-career' },
    { label: 'Sports & Knowledge', path: '/category/sports-knowledge' },
    { label: 'Sports', path: '/category/sports' },
    { label: 'Science', path: '/category/science' },
    { label: 'Automobile', path: '/category/automobile' },
    { label: 'Facts & Knowledge', path: '/category/facts-knowledge' },
    { label: 'Community', path: '/category/community' },
    { label: 'Guest Posting', path: '/category/guest-posting' },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Categories</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            <FiX />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {categories.map(cat => (
            <Link key={cat.path} to={cat.path} className="sidebar-category" onClick={onClose}>
              {cat.label}
            </Link>
          ))}
        </div>
        <div style={{ marginTop: '25px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '15px' }}>Follow Us</h3>
          <div style={{ display: 'flex', gap: '15px', fontSize: '1.2rem' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>FB</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>TW</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>IG</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
