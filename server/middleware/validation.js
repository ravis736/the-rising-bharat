const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    return res.status(400).json({
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
  next();
};

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores (no spaces or special characters)'),
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address (e.g., name@example.com)')
    .normalizeEmail(),
  body('mobile')
    .optional({ values: 'falsy' })
    .matches(/^[+]?[\d\s()-]{7,20}$/).withMessage('Please enter a valid mobile number (e.g., +91 9876543210 or 9876543210)'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors,
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('mobile')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[+]?[\d\s()-]{7,20}$/).withMessage('Please enter a valid mobile number (e.g., +91 9876543210 or 9876543210)'),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters'),
  handleValidationErrors,
];

const articleValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Blog title must be between 5 and 200 characters'),
  body('slug')
    .optional({ values: 'falsy' })
    .trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('content')
    .trim()
    .isLength({ min: 50 }).withMessage('Blog content must be at least 50 characters'),
  body('category')
    .trim()
    .notEmpty().withMessage('Please select a category for the blog'),
  handleValidationErrors,
];

const subscriptionValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  handleValidationErrors,
];

module.exports = {
  registerValidation, loginValidation, contactValidation,
  articleValidation, subscriptionValidation, handleValidationErrors,
};
