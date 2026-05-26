const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');
const { sanitizeInput } = require('./middleware/sanitize');
const { setCacheHeaders } = require('./middleware/cache');
const { generateCsrfToken, validateCsrfToken } = require('./middleware/csrf');
const { getSitemap, getRobotsTxt, getCsrfToken } = require('./controllers/miscController');

dotenv.config();
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
// }));



app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(sanitizeInput);
app.use(setCacheHeaders);

// CSRF - generate token for all requests
app.use(generateCsrfToken);

// API routes (CSRF protected for mutations)
app.use('/api/users', validateCsrfToken, require('./routes/userRoutes'));
app.use('/api/staff', validateCsrfToken, require('./routes/staffRoutes'));
app.use('/api/articles', validateCsrfToken, require('./routes/articleRoutes'));
app.use('/api/interactions', validateCsrfToken, require('./routes/interactionRoutes'));

// Misc routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'The Rising Bharat API is running' });
});
app.get('/api/csrf-token', getCsrfToken);

// SEO routes
app.get('/sitemap.xml', getSitemap);
app.get('/robots.txt', getRobotsTxt);

// // Serve static files from React build
// const clientBuild = path.join(__dirname, '..', 'client', 'build');
// app.use(express.static(clientBuild, {
//   maxAge: '1y',
//   immutable: true,
//   setHeaders: (res, filePath) => {
//     if (filePath.endsWith('.html')) {
//       res.setHeader('Cache-Control', 'no-cache');
//     }
//   },
// }));

// // SSR - Server side rendering for bot/crawler requests
// const ssrMiddleware = require('./ssr');
// app.use(ssrMiddleware);

// // Fallback to React SPA for all other routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(clientBuild, 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
