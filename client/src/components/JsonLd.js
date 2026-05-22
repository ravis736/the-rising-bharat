import React from 'react';
import { Helmet } from 'react-helmet-async';

const JsonLd = ({ type = 'WebSite', data = {} }) => {
  const baseUrl = window.location.origin;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: 'The Rising Bharat',
    url: baseUrl,
    description: 'Your trusted source for news, insights, and stories across technology, business, lifestyle, sports, education, and more.',
    publisher: {
      '@type': 'Organization',
      name: 'The Rising Bharat',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo192.png`,
      },
    },
    ...data,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(defaultSchema)}</script>
    </Helmet>
  );
};

export const ArticleJsonLd = ({ article }) => {
  const baseUrl = window.location.origin;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article?.title || '',
    description: article?.tagline || article?.metaDescription || '',
    image: article?.featuredImage || `${baseUrl}/logo192.png`,
    datePublished: article?.publishedAt || new Date().toISOString(),
    dateModified: article?.updatedAt || article?.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article?.authorName || 'The Rising Bharat',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Rising Bharat',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo192.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${article?._id}`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const BreadcrumbJsonLd = ({ items }) => {
  const baseUrl = window.location.origin;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${baseUrl}${item.path}` : undefined,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default JsonLd;
