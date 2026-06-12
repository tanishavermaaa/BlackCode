const logger = require('../utils/logger');
const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    statusCode: err.statusCode
  });

  const isDev = config.nodeEnv === 'development';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(isDev && { stack: err.stack })
  });
};

module.exports = errorHandler;
