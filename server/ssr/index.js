const React = require('react');
const { renderToString } = require('react-dom/server');
const { HelmetProvider } = require('react-helmet-async');
const path = require('path');
const fs = require('fs');

const botPattern = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|facebot|discordbot|slackbot|telegrambot/i;

const ssrMiddleware = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = botPattern.test(userAgent);

  // Only SSR for bot requests or first-time visits
  if (!isBot && !req.query._escaped_fragment_) {
    return next();
  }

  // Skip API routes and static files
  if (req.path.startsWith('/api/') || req.path.match(/\.(js|css|png|jpg|json|ico|svg|woff|woff2)$/)) {
    return next();
  }

  try {
    const htmlTemplate = path.join(__dirname, '..', '..', 'client', 'build', 'index.html');
    let template = fs.readFileSync(htmlTemplate, 'utf8');

    // For now, generate basic SEO-optimized HTML for key pages
    const seoData = getSeoData(req.path);

    template = template.replace(/<title>.*?<\/title>/, `<title>${seoData.title}</title>`);
    template = template.replace(
      '<meta name="description" content=""/>',
      `<meta name="description" content="${seoData.description}"/>`
    );
    template = template.replace(
      '<meta name="keywords" content=""/>',
      `<meta name="keywords" content="${seoData.keywords}"/>`
    );

    // Open Graph tags
    const ogTags = `
      <meta property="og:title" content="${seoData.title}" />
      <meta property="og:description" content="${seoData.description}" />
      <meta property="og:url" content="${process.env.CLIENT_URL || 'http://localhost:3000'}${req.path}" />
      <meta property="og:type" content="${seoData.type || 'website'}" />
      <meta property="og:image" content="${seoData.image || (process.env.CLIENT_URL || 'http://localhost:3000') + '/logo192.png'}" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${seoData.title}" />
      <meta name="twitter:description" content="${seoData.description}" />
    `;
    template = template.replace('</head>', `${ogTags}</head>`);

    // JSON-LD Schema
    const jsonLd = generateJsonLd(req.path, seoData);
    template = template.replace('</head>', `${jsonLd}</head>`);

    res.send(template);
  } catch (error) {
    console.error('SSR error:', error.message);
    next();
  }
};

function getSeoData(urlPath) {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const defaultData = {
    title: 'The Rising Bharat - News, Insights & Stories',
    description: 'Your trusted source for news, insights, and stories across technology, business, lifestyle, sports, education, and more.',
    keywords: 'news, india, bharat, technology, business, lifestyle, sports, education, current affairs',
    type: 'website',
    image: `${baseUrl}/logo192.png`,
  };

  const pages = {
    '/': { title: 'The Rising Bharat - News, Insights & Stories', description: 'Latest news and insights across technology, business, lifestyle, sports, education and more.' },
    '/about': { title: 'About Us | The Rising Bharat', description: 'Learn about The Rising Bharat mission, vision, and commitment to quality news delivery.' },
    '/contact': { title: 'Contact Us | The Rising Bharat', description: 'Get in touch with The Rising Bharat team for inquiries, feedback, and collaborations.' },
    '/privacy-policy': { title: 'Privacy Policy | The Rising Bharat', description: 'Understand how The Rising Bharat collects, uses, and protects your personal data.' },
    '/terms-conditions': { title: 'Terms & Conditions | The Rising Bharat', description: 'Read the terms and conditions for using The Rising Bharat platform.' },
    '/disclaimer': { title: 'Disclaimer | The Rising Bharat', description: 'Important disclaimer about the information published on The Rising Bharat.' },
    '/advertise': { title: 'Advertise With Us | The Rising Bharat', description: 'Reach a growing audience by advertising on The Rising Bharat platform.' },
    '/authors': { title: 'Our Team | The Rising Bharat', description: 'Meet the writers, editors, and contributors behind The Rising Bharat.' },
    '/dmca': { title: 'DMCA Policy | The Rising Bharat', description: 'Copyright infringement reporting and takedown policy for The Rising Bharat.' },
  };

  const matched = Object.entries(pages).find(([key]) => urlPath === key);
  if (matched) {
    return { ...defaultData, ...matched[1] };
  }

  if (urlPath.startsWith('/blog/')) {
    return {
      ...defaultData,
      title: 'Article | The Rising Bharat',
      description: 'Read the latest article on The Rising Bharat',
      type: 'article',
    };
  }

  if (urlPath.startsWith('/category/')) {
    const category = urlPath.split('/').pop().replace(/-/g, ' ');
    return {
      ...defaultData,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} | The Rising Bharat`,
      description: `Browse articles in ${category} category on The Rising Bharat.`,
    };
  }

  return defaultData;
}

function generateJsonLd(urlPath, seoData) {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Rising Bharat',
    url: baseUrl,
    description: seoData.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  if (urlPath.startsWith('/blog/')) {
    schema['@type'] = 'NewsArticle';
    schema.headline = seoData.title;
  }

  if (urlPath === '/') {
    schema.publisher = {
      '@type': 'Organization',
      name: 'The Rising Bharat',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo192.png`,
      },
    };
  }

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

module.exports = ssrMiddleware;
