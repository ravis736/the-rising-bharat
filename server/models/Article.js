const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const articleSchema = new mongoose.Schema({
  pageTitle: { type: String, required: true },
  metaDescription: { type: String, default: '' },
  metaKeywords: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: [
      'government-sector', 'business-finance', 'world-news', 'crime-law',
      'environment', 'social-issues', 'latest-updates',
      'technology', 'ai-news', 'gaming',
      'lifestyle', 'entertainment', 'health-fitness', 'religion-culture',
      'education', 'jobs-career',
      'sports', 'science', 'automobile', 'facts-knowledge',
      'guest-posting',
    ],
  },
  mainCategory: {
    type: String,
    enum: [
      'public-government-affairs', 'digital-future-tech',
      'lifestyle-culture', 'education-careers',
      'sports-knowledge', 'community',
    ],
  },
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  tagline: { type: String, default: '' },
  tags: [{ type: String }],
  content: { type: String, required: true },
  featuredImage: { type: String, default: '' },
  imageAltText: { type: String, default: '' },
  imageSourceLink: { type: String, default: '' },
  faqs: [faqSchema],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
  },
  authorName: { type: String, default: '' },
  readingTime: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
}, { timestamps: true });

articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ mainCategory: 1, publishedAt: -1 });
articleSchema.index({ tags: 1 });

module.exports = mongoose.model('Article', articleSchema);
