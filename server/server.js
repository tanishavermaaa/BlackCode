const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./src/config/config');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');
const AppError = require('./src/utils/AppError');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

// 1. HTTP Security Headers
app.use(helmet());

// 2. CORS configurations with origin whitelisting
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }
    const sanitizedOrigin = origin.trim().replace(/\/$/, '');
    if (config.allowedOrigins.indexOf(sanitizedOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Request parsers
app.use(express.json());
app.use(cookieParser());

// 4. Request logging
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// 5. Rate limiting for API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Serve static assets in production
if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  // Health check / welcome route
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to BlackCube API Server' });
  });
}

// 6. Unknown routes mapping
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 7. Centralized global error handler middleware (must be last)
app.use(errorHandler);

// Database connection & Startup
mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info('MongoDB Connected successfully');
    app.listen(config.port, () => {
      logger.info(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  })
  .catch(err => {
    logger.error(`Database connection failed: ${err.message}`);
    process.exit(1); // Fail fast
  });
