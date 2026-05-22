import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../utils/i18n';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';

const Footer = ({ lang }) => {
  const t = (key) => getTranslation(key, lang);

  const importantLinks = [
    { label: t('home'), path: '/' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contact' },
    { label: t('privacy'), path: '/privacy-policy' },
    { label: t('terms'), path: '/terms-conditions' },
    { label: t('disclaimer'), path: '/disclaimer' },
    { label: t('advertise'), path: '/advertise' },
    { label: t('authors'), path: '/authors' },
    { label: t('dmca'), path: '/dmca' },
  ];

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', marginTop: '60px' }}>
      <div className="container" style={{ padding: '50px 0 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* About Section */}
          <div>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, display: 'inline-block', marginBottom: '15px' }}>
              The Rising Bharat
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
              {t('aboutWebsite')}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}><FiFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}><FiTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}><FiInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}><FiLinkedin /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}><FiYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>{t('quickLinks')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {importantLinks.map(link => (
                <Link key={link.path} to={link.path} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Contact Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiMapPin /> <span>New Delhi, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiMail /> <span>info@therisingbharat.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiPhone /> <span>+91-XXXXXXXXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            &copy; {new Date().getFullYear()} The Rising Bharat. {t('allRightsReserved')} {t('poweredBy')} The Rising Bharat Team.
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/privacy-policy" style={{ color: 'var(--text-muted)' }}>{t('privacy')}</Link>
            <Link to="/terms-conditions" style={{ color: 'var(--text-muted)' }}>{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
