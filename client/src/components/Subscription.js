import React, { useState } from 'react';
import api from '../utils/api';
import { getTranslation } from '../utils/i18n';

const Subscription = ({ lang }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const t = (key) => getTranslation(key, lang);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/interactions/subscribe', { email });
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="subscription-section">
      <h2 className="subscription-title">{t('subscribe')}</h2>
      <p className="subscription-subtitle">{t('subscribeMsg')}</p>
      <form className="subscription-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-accent">{t('subscribe')}</button>
      </form>
      {message && (
        <p style={{ marginTop: '15px', color: isSuccess ? 'green' : 'red', fontSize: '0.9rem' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Subscription;
