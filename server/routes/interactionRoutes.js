const express = require('express');
const router = express.Router();
const { addComment, getComments, addReply, getReplies, toggleLike, toggleDislike, subscribe, submitContact } = require('../controllers/interactionController');
const { protect } = require('../middleware/auth');
const { contactValidation, subscriptionValidation } = require('../middleware/validation');

router.post('/subscribe', subscriptionValidation, subscribe);
router.post('/contact', contactValidation, submitContact);
router.get('/comments/:articleId', getComments);
router.post('/comments/:articleId', protect, addComment);
router.get('/replies/:commentId', getReplies);
router.post('/replies/:articleId/:commentId', protect, addReply);
router.post('/like/:type/:id', protect, toggleLike);
router.post('/dislike/:type/:id', protect, toggleDislike);

module.exports = router;
