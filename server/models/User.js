const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  socialLinks: {
    google: String,
    facebook: String,
    twitter: String,
  },
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
  }],
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
  },
  privacySettings: {
    showProfile: { type: Boolean, default: true },
    showSavedPosts: { type: Boolean, default: false },
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
