const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, getUserProfile, updateUserProfile, savePost } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|bmp|webp|svg|ico|tiff|tif|heic|heif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
  const mimetype = allowedTypes.test(file.mimetype);
  cb(null, extname || mimetype);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/register', upload.single('profilePhoto'), registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePhoto'), updateUserProfile);
router.post('/save-post/:articleId', protect, savePost);

module.exports = router;
