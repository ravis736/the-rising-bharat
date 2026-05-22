import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation, languages } from '../utils/i18n';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';
import getImageUrl from '../utils/imageUrl';

const categoriesTree = {
  'Public & Govt Affairs': {
    path: '/category/public-government-affairs',
    subs: [
      { label: 'Government Sector', path: '/category/government-sector' },
      { label: 'Business & Finance', path: '/category/business-finance' },
      { label: 'World News', path: '/category/world-news' },
      { label: 'Crime & Law', path: '/category/crime-law' },
      { label: 'Environment', path: '/category/environment' },
      { label: 'Social Issues', path: '/category/social-issues' },
      { label: 'Latest Updates', path: '/category/latest-updates' },
    ],
  },
  'Digital & Future Tech': {
    path: '/category/digital-future-tech',
    subs: [
      { label: 'Technology', path: '/category/technology' },
      { label: 'AI News', path: '/category/ai-news' },
      { label: 'Gaming', path: '/category/gaming' },
    ],
  },
  'Lifestyle & Culture': {
    path: '/category/lifestyle-culture',
    subs: [
      { label: 'Lifestyle', path: '/category/lifestyle' },
      { label: 'Entertainment', path: '/category/entertainment' },
      { label: 'Health & Fitness', path: '/category/health-fitness' },
      { label: 'Religion & Culture', path: '/category/religion-culture' },
    ],
  },
  'Education & Careers': {
    path: '/category/education-careers',
    subs: [
      { label: 'Education', path: '/category/education' },
      { label: 'Jobs & Career', path: '/category/jobs-career' },
    ],
  },
  'Sports & Knowledge': {
    path: '/category/sports-knowledge',
    subs: [
      { label: 'Sports', path: '/category/sports' },
      { label: 'Science', path: '/category/science' },
      { label: 'Automobile', path: '/category/automobile' },
      { label: 'Facts & Knowledge', path: '/category/facts-knowledge' },
    ],
  },
  'Community': {
    path: '/category/community',
    subs: [
      { label: 'Guest Posting', path: '/category/guest-posting' },
    ],
  },
};

const Header = ({ lang, setLang }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, staff, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('New Delhi');
  const [country, setCountry] = useState('IN');
  const [marqueeArticles, setMarqueeArticles] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [activeParent, setActiveParent] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetchMarqueeArticles();
    fetchLocation();
    return () => clearInterval(timer);
  }, []);

  const fetchMarqueeArticles = async () => {
    try {
      const { data } = await api.get('/articles/hero');
      setMarqueeArticles(data || []);
    } catch { }
  };

  const fetchLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setCity(data.city || 'New Delhi');
      setCountry(data.country_code || 'IN');
    } catch { }
  };

  const t = (key) => getTranslation(key, lang);

  const navLinks = [
    { label: t('home'), path: '/' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contact' },
    { label: t('authors'), path: '/authors' },
    { label: t('advertise'), path: '/advertise' },
  ];

  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = time.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setProfileOpen(false);
    navigate('/');
  };

  const userDisplay = user || staff;

  const dropdownBase = {
    position: 'absolute', background: 'var(--bg-secondary)', borderRadius: '8px',
    boxShadow: 'var(--shadow-hover)', padding: '8px 0', zIndex: 100, minWidth: '220px',
  };
  const linkItem = { display: 'block', padding: '8px 20px', fontSize: '0.85rem', fontWeight: 500 };
  const subLinkItem = { display: 'block', padding: '6px 16px', fontSize: '0.82rem', color: 'var(--text-secondary)' };

  return (
    <header className="glass-header">
      {/* Top Bar */}
      <div className="top-bar" style={{ padding: '6px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span>{country === 'IN' ? '🇮🇳' : '🌍'}</span>
          <span>{dayName}, {dateStr} | {timeStr}</span>
          {weather && <span>{Math.round(weather)}°C</span>}
          <span>{city}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="lang-switcher">
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              {languages.map(l => (
                <option key={l.code} value={l.code}>{l.nativeName}</option>
              ))}
            </select>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div style={{ padding: '10px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          The Rising Bharat
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {link.label}
            </Link>
          ))}

          {/* Single Categories Dropdown with Nested Sub-categories */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setCatMenuOpen(true)}
            onMouseLeave={() => { setCatMenuOpen(false); setActiveParent(null); }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Categories <FiChevronDown size={14} />
            </span>

            {catMenuOpen && (
              <div style={{ ...dropdownBase, top: '100%', left: 0 }}>
                {Object.entries(categoriesTree).map(([parentName, parentData]) => (
                  <div key={parentName} style={{ position: 'relative' }}
                    onMouseEnter={() => setActiveParent(parentName)}
                    onMouseLeave={() => setActiveParent(null)}
                  >
                    <Link to={parentData.path}
                      style={{ ...linkItem, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {parentName} <FiChevronRight size={12} />
                    </Link>

                    {/* Sub-categories flyout */}
                    {activeParent === parentName && (
                      <div style={{ ...dropdownBase, top: 0, left: '100%', marginLeft: '4px' }}>
                        {parentData.subs.map(sub => (
                          <Link key={sub.path} to={sub.path} style={subLinkItem}>
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {userDisplay ? (
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <div style={{ position: 'relative', width: '34px', height: '34px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {userDisplay.profilePhoto ? (
                      <img src={getImageUrl(userDisplay.profilePhoto)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <FiUser size={18} />
                    )}
                  </div>
                  <span style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', border: '2px solid var(--bg-primary)' }} />
                </div>
              </div>

              {profileOpen && (
                <div style={{ ...dropdownBase, right: 0, top: '100%', minWidth: '200px' }}>
                  <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{userDisplay.username}</strong>
                    <p style={{ fontSize: '0.75rem', color: '#2ecc71' }}>● Online</p>
                  </div>
                  <Link to={staff ? '/staff/dashboard' : '/dashboard'} style={linkItem}>Dashboard</Link>
                  {staff && <Link to="/staff/new-blog" style={linkItem}>New Blog</Link>}
                  {staff && <Link to="/staff/blogs" style={linkItem}>All Blogs</Link>}
                  {staff && staff.role === 'admin' && <Link to="/staff/list" style={linkItem}>Staff List</Link>}
                  <button onClick={handleLogout} style={{ ...linkItem, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>
                    <FiLogOut style={{ marginRight: 6 }} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>{t('login')}</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>{t('register')}</Link>
            </>
          )}
          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '300px', height: '100vh',
          background: 'var(--bg-secondary)', zIndex: 1001, boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
          padding: '80px 25px 25px', overflowY: 'auto',
        }}>
          <button onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            <FiX />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1rem', fontWeight: 500, padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', color: 'var(--accent)' }}>Categories</p>
              {Object.entries(categoriesTree).map(([parentName, parentData]) => (
                <div key={parentName}>
                  <Link to={parentData.path} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '8px 0', fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>
                    {parentName}
                  </Link>
                  {parentData.subs.map(sub => (
                    <Link key={sub.path} to={sub.path} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '6px 0 6px 15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            {userDisplay ? (
              <button onClick={handleLogout} style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-family)' }}>
                <FiLogOut style={{ marginRight: 8 }} /> Logout
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline" style={{ textAlign: 'center' }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
      )}

      {/* Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          {marqueeArticles.map(article => (
            <Link key={article._id} to={`/blog/${article.slug || article._id}`}>
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
