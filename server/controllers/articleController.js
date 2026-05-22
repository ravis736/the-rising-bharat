const mongoose = require('mongoose');
const Article = require('../models/Article');

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 200);
};

const createArticle = async (req, res) => {
  try {
    const { pageTitle, metaDescription, metaKeywords, category, mainCategory, title, slug, tagline, tags, content, imageAltText, imageSourceLink, faqs } = req.body;
    const readingTime = Math.ceil(content.split(/\s+/).length / 200);
    let articleSlug = slug || generateSlug(title);
    let slugExists = await Article.findOne({ slug: articleSlug });
    let counter = 1;
    while (slugExists) {
      articleSlug = `${generateSlug(title)}-${counter}`;
      slugExists = await Article.findOne({ slug: articleSlug });
      counter++;
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const article = await Article.create({
      pageTitle, metaDescription, metaKeywords, category, mainCategory, title,
      slug: articleSlug, tagline,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      content,
      featuredImage: req.file ? `${baseUrl}/uploads/${req.file.filename}` : (req.body.featuredImage || ''),
      imageAltText, imageSourceLink,
      faqs: faqs ? JSON.parse(faqs) : [],
      author: req.staff._id,
      authorName: req.staff.username,
      readingTime,
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticles = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const articles = await Article.find(query)
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Article.countDocuments(query);
    res.json({ articles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : undefined },
        { slug: id },
      ].filter(Boolean),
    }).populate('author', 'username');
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    article.views += 1;
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRelatedArticles = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    const related = await Article.find({
      _id: { $ne: article._id },
      $or: [
        { category: article.category },
        { mainCategory: article.mainCategory },
        { tags: { $in: article.tags } },
      ],
      isPublished: true,
    }).limit(6).sort({ publishedAt: -1 });
    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const articles = await Article.find({ category, isPublished: true })
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Article.countDocuments({ category, isPublished: true });
    res.json({ articles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticlesByMainCategory = async (req, res) => {
  try {
    const { mainCategory } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const articles = await Article.find({ mainCategory, isPublished: true })
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Article.countDocuments({ mainCategory, isPublished: true });
    res.json({ articles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHeroArticles = async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true })
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .limit(10);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryGroupedArticles = async (req, res) => {
  try {
    const categories = [
      'government-sector', 'business-finance', 'world-news', 'crime-law',
      'environment', 'social-issues', 'latest-updates',
      'technology', 'ai-news', 'gaming',
      'lifestyle', 'entertainment', 'health-fitness', 'religion-culture',
      'education', 'jobs-career',
      'sports', 'science', 'automobile', 'facts-knowledge',
      'guest-posting',
    ];
    const result = {};
    for (const cat of categories) {
      const articles = await Article.find({ category: cat, isPublished: true })
        .populate('author', 'username')
        .sort({ publishedAt: -1 })
        .limit(7);
      if (articles.length > 0) result[cat] = articles;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    const fields = ['pageTitle', 'metaDescription', 'metaKeywords', 'category', 'mainCategory', 'title', 'slug', 'tagline', 'content', 'imageAltText', 'imageSourceLink'];
    fields.forEach(field => {
      if (req.body[field]) article[field] = req.body[field];
    });
    if (req.body.tags) article.tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map(t => t.trim()) : req.body.tags;
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      article.featuredImage = `${baseUrl}/uploads/${req.file.filename}`;
    }
    if (req.body.faqs) article.faqs = typeof req.body.faqs === 'string' ? JSON.parse(req.body.faqs) : req.body.faqs;
    if (req.body.content) article.readingTime = Math.ceil(req.body.content.split(/\s+/).length / 200);
    if (!article.slug && req.body.title) {
      article.slug = generateSlug(req.body.title);
    }
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticlesByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const articles = await Article.find({ tags: tag, isPublished: true })
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Article.countDocuments({ tags: tag, isPublished: true });
    res.json({ articles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createArticle, getArticles, getArticleBySlug, getRelatedArticles, getArticlesByCategory, getArticlesByMainCategory, getHeroArticles, getCategoryGroupedArticles, getArticlesByTag, updateArticle, deleteArticle };
