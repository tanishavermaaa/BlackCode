const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const config = require('../src/config/config');
const AppError = require('../src/utils/AppError');
const { validatePassword, BCRYPT_ROUNDS } = require('../src/validators/password');

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Helper to generate access and refresh tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    config.refreshSecret,
    { expiresIn: config.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

// Helper to set refresh token HttpOnly cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });
};

// @route   POST api/auth/signup
// @desc    Register a user
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { name, email, mobileNumber, password, confirmPassword } = req.body;

  if (!name || !email || !mobileNumber || !password || !confirmPassword) {
    return next(new AppError('Please enter all fields', 400));
  }

  if (!validateEmail(email)) {
    return next(new AppError('Please enter a valid email address', 400));
  }

  const passwordVal = validatePassword(password);
  if (!passwordVal.valid) {
    return next(new AppError(passwordVal.message, 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return next(new AppError('A user with this email already exists', 400));
    }

    user = new User({
      name,
      email,
      mobileNumber,
      password
    });

    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user.id);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please enter all fields', 400));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid credentials', 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 400));
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST api/auth/refresh
// @desc    Get new access token from refresh token
// @access  Public
router.post('/refresh', async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return next(new AppError('No refresh token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, config.refreshSecret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    // Optional: Rotate refresh token too or just send new access token
    const accessToken = jwt.sign(
      { id: user.id },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.json({ token: accessToken });
  } catch (err) {
    return next(new AppError('Invalid or expired refresh token', 401));
  }
});

// @route   POST api/auth/logout
// @desc    Clear refresh token cookie
// @access  Public
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax'
  });
  res.json({ message: 'Logged out successfully' });
});

// @route   GET api/auth/profile
// @desc    Get user profile details
// @access  Private
router.get('/profile', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
