const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const crypto = require('crypto');

const registerUser = async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      username,
      email,
      mobile,
      password,
      verificationToken,
      profilePhoto: req.file ? `/uploads/${req.file.filename}` : '',
    });
    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: 'Registration successful. Please verify your email.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) user.password = req.body.password;
      if (req.file) user.profilePhoto = `/uploads/${req.file.filename}`;
      if (req.body.notificationPreferences) {
        user.notificationPreferences = { ...user.notificationPreferences, ...req.body.notificationPreferences };
      }
      if (req.body.privacySettings) {
        user.privacySettings = { ...user.privacySettings, ...req.body.privacySettings };
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePhoto: updatedUser.profilePhoto,
        notificationPreferences: updatedUser.notificationPreferences,
        privacySettings: updatedUser.privacySettings,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const savePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const articleId = req.params.articleId;
    if (user.savedPosts.includes(articleId)) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== articleId);
    } else {
      user.savedPosts.push(articleId);
    }
    await user.save();
    res.json({ savedPosts: user.savedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, getUserProfile, updateUserProfile, savePost };
