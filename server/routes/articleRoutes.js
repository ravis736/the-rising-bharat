const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createArticle, getArticles, getArticleBySlug, getRelatedArticles, getArticlesByCategory, getArticlesByMainCategory, getHeroArticles, getCategoryGroupedArticles, getArticlesByTag, updateArticle, deleteArticle } = require('../controllers/articleController');
const { staffProtect } = require('../middleware/auth');
const { articleValidation } = require('../middleware/validation');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|svg|ico|tiff|tif|heic|heif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, gif, webp, svg, bmp, tiff, heic)'));
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/hero', getHeroArticles);
router.get('/grouped', getCategoryGroupedArticles);
router.get('/related/:id', getRelatedArticles);
router.get('/category/:category', getArticlesByCategory);
router.get('/main-category/:mainCategory', getArticlesByMainCategory);
router.get('/tag/:tag', getArticlesByTag);
router.get('/', getArticles);
router.get('/:id', getArticleBySlug);
router.post('/', staffProtect, upload.single('featuredImage'), articleValidation, createArticle);
router.put('/:id', staffProtect, upload.single('featuredImage'), articleValidation, updateArticle);
router.delete('/:id', staffProtect, deleteArticle);

module.exports = router;
