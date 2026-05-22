import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, image, article }) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  const currentUrl = `${baseUrl}${location.pathname}`;

  const defaultTitle = 'The Rising Bharat - News, Insights & Stories';
  const defaultDescription = 'Your trusted source for news, insights, and stories across technology, business, lifestyle, sports, education, and more.';
  const defaultKeywords = 'news, india, bharat, technology, business, lifestyle, sports, education, current affairs';
  const defaultImage = `${baseUrl}/logo192.png`;

  const pageTitle = title ? `${title} | The Rising Bharat` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  const pageImage = image || (article?.featuredImage) || defaultImage;
  const pageType = article ? 'article' : 'website';

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={pageType} />
      <meta property="og:site_name" content="The Rising Bharat" />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Article specific */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedAt} />
          <meta property="article:modified_time" content={article.updatedAt || article.publishedAt} />
          <meta property="article:section" content={article.category} />
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
    </Helmet>
  );
};

export default SEO;
