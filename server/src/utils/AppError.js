class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // flag to distinguish operational errors from programmer/system bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
