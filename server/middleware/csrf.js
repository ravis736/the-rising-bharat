const crypto = require('crypto');

const generateCsrfToken = (req, res, next) => {
  if (!req.cookies || !req.cookies['csrf-token']) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf-token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    req.csrfToken = token;
  } else {
    req.csrfToken = req.cookies['csrf-token'];
  }
  next();
};

const validateCsrfToken = (req, res, next) => {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }
  const headerToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies && req.cookies['csrf-token'];
  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  next();
};

module.exports = { generateCsrfToken, validateCsrfToken };
