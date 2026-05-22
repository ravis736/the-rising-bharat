const Article = require('../models/Article');

const getSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const articles = await Article.find({ isPublished: true }).select('_id slug updatedAt category').sort({ publishedAt: -1 });

    const staticPages = [
      '', '/about', '/contact', '/privacy-policy', '/terms-conditions',
      '/disclaimer', '/advertise', '/authors', '/dmca', '/login', '/register',
    ];

    const categories = [
      'public-government-affairs', 'government-sector', 'business-finance',
      'world-news', 'crime-law', 'environment', 'social-issues', 'latest-updates',
      'digital-future-tech', 'technology', 'ai-news', 'gaming',
      'lifestyle-culture', 'lifestyle', 'entertainment', 'health-fitness', 'religion-culture',
      'education-careers', 'education', 'jobs-career',
      'sports-knowledge', 'sports', 'science', 'automobile', 'facts-knowledge',
      'community', 'guest-posting',
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    staticPages.forEach(page => {
      xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    categories.forEach(cat => {
      xml += `  <url>\n    <loc>${baseUrl}/category/${cat}</loc>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    articles.forEach(article => {
      const articleUrl = article.slug || article._id;
      xml += `  <url>\n    <loc>${baseUrl}/blog/${articleUrl}</loc>\n    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRobotsTxt = (req, res) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n\nDisallow: /dashboard\nDisallow: /staff/\nDisallow: /api/\n`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
};

const getCsrfToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken });
};

module.exports = { getSitemap, getRobotsTxt, getCsrfToken };
