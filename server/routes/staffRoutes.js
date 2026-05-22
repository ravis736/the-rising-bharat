const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerStaff, loginStaff, getStaffList, toggleStaffStatus, getStaffProfile, updateStaffProfile, updateStaffRole, forgotPassword } = require('../controllers/staffController');
const { staffProtect, adminOnly } = require('../middleware/auth');
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

router.post('/register', upload.single('profilePhoto'), registerValidation, registerStaff);
router.post('/login', loginValidation, loginStaff);
router.post('/forgot-password', forgotPassword);
router.get('/profile', staffProtect, getStaffProfile);
router.put('/profile', staffProtect, upload.single('profilePhoto'), updateStaffProfile);
router.get('/list', staffProtect, adminOnly, getStaffList);
router.put('/toggle-status/:id', staffProtect, adminOnly, toggleStaffStatus);
router.put('/update-role/:id', staffProtect, adminOnly, updateStaffRole);

module.exports = router;
