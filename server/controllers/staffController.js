const Staff = require('../models/Staff');
const generateToken = require('../utils/generateToken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const crypto = require('crypto');

const registerStaff = async (req, res) => {
  try {
    const { username, email, mobile, password, role } = req.body;
    const existingStaff = await Staff.findOne({ $or: [{ email }, { username }] });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff already exists' });
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const staff = await Staff.create({
      username,
      email,
      mobile,
      password,
      role: role || 'editor',
      isActive: false,
      verificationToken,
      profilePhoto: req.file ? `/uploads/${req.file.filename}` : '',
    });
    await sendVerificationEmail(email, verificationToken, 'staff');
    res.status(201).json({
      _id: staff._id,
      username: staff.username,
      email: staff.email,
      role: staff.role,
      message: 'Staff registered. Admin will activate your account.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!staff.isActive) {
      return res.status(401).json({ message: 'Account is disabled. Contact admin.' });
    }
    if (staff && (await staff.matchPassword(password))) {
      res.json({
        _id: staff._id,
        username: staff.username,
        email: staff.email,
        role: staff.role,
        profilePhoto: staff.profilePhoto,
        token: generateToken(staff._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStaffList = async (req, res) => {
  try {
    const staff = await Staff.find().select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleStaffStatus = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    staff.isActive = !staff.isActive;
    await staff.save();
    res.json({ isActive: staff.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.staff._id).select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.staff._id);
    if (staff) {
      staff.username = req.body.username || staff.username;
      staff.email = req.body.email || staff.email;
      if (req.body.password) staff.password = req.body.password;
      if (req.file) staff.profilePhoto = `/uploads/${req.file.filename}`;
      await staff.save();
      res.json({
        _id: staff._id,
        username: staff.username,
        email: staff.email,
        profilePhoto: staff.profilePhoto,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStaffRole = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    staff.role = req.body.role;
    await staff.save();
    res.json({ role: staff.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const staff = await Staff.findOne({ email: req.body.email });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    staff.resetPasswordToken = resetToken;
    staff.resetPasswordExpires = Date.now() + 3600000;
    await staff.save();
    await sendPasswordResetEmail(staff.email, resetToken, 'staff');
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerStaff, loginStaff, getStaffList, toggleStaffStatus, getStaffProfile, updateStaffProfile, updateStaffRole, forgotPassword };
