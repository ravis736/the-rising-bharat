const Comment = require('../models/Comment');
const Reply = require('../models/Reply');
const Subscription = require('../models/Subscription');
const Contact = require('../models/Contact');
const { sendSubscriptionConfirmation } = require('../utils/emailService');

// Comment
const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      article: req.params.articleId,
      user: req.user._id,
      text: req.body.text,
    });
    const populated = await Comment.findById(comment._id).populate('user', 'username profilePhoto');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('user', 'username profilePhoto')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply
const addReply = async (req, res) => {
  try {
    const replyData = {
      article: req.params.articleId,
      comment: req.params.commentId,
      user: req.user._id,
      text: req.body.text,
    };
    if (req.body.parentReply) replyData.parentReply = req.body.parentReply;
    const reply = await Reply.create(replyData);
    const populated = await Reply.findById(reply._id).populate('user', 'username profilePhoto');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReplies = async (req, res) => {
  try {
    const replies = await Reply.find({ comment: req.params.commentId })
      .populate('user', 'username profilePhoto')
      .sort({ createdAt: -1 });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Dislike
const toggleLike = async (req, res) => {
  try {
    const { type, id } = req.params;
    let doc;
    if (type === 'comment') doc = await Comment.findById(id);
    else if (type === 'reply') doc = await Reply.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const userId = req.user._id;
    const likeIndex = doc.likes.indexOf(userId);
    const dislikeIndex = doc.dislikes.indexOf(userId);

    if (likeIndex > -1) {
      doc.likes.splice(likeIndex, 1);
    } else {
      doc.likes.push(userId);
      if (dislikeIndex > -1) doc.dislikes.splice(dislikeIndex, 1);
    }
    await doc.save();
    res.json({ likes: doc.likes.length, dislikes: doc.dislikes.length, userLiked: likeIndex === -1, userDisliked: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleDislike = async (req, res) => {
  try {
    const { type, id } = req.params;
    let doc;
    if (type === 'comment') doc = await Comment.findById(id);
    else if (type === 'reply') doc = await Reply.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const userId = req.user._id;
    const likeIndex = doc.likes.indexOf(userId);
    const dislikeIndex = doc.dislikes.indexOf(userId);

    if (dislikeIndex > -1) {
      doc.dislikes.splice(dislikeIndex, 1);
    } else {
      doc.dislikes.push(userId);
      if (likeIndex > -1) doc.likes.splice(likeIndex, 1);
    }
    await doc.save();
    res.json({ likes: doc.likes.length, dislikes: doc.dislikes.length, userLiked: false, userDisliked: dislikeIndex === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subscription
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Subscription.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
      }
      await sendSubscriptionConfirmation(email);
      return res.json({ message: 'Subscription confirmed' });
    }
    await Subscription.create({ email });
    await sendSubscriptionConfirmation(email);
    res.status(201).json({ message: 'Subscription successful. Check your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Contact
const submitContact = async (req, res) => {
  try {
    const { type, name, email, mobile, subject, message } = req.body;
    await Contact.create({ type, name, email, mobile, subject, message });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments, addReply, getReplies, toggleLike, toggleDislike, subscribe, submitContact };
