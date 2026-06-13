const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const AppError = require('../src/utils/AppError');

// Helper to validate price
const validatePrice = (price) => {
  const p = parseFloat(price);
  return !isNaN(p) && p > 0;
};

// @route   GET api/products
// @desc    Get all products (paginated)
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12); // Default to 12, cap at 50

    const [products, total] = await Promise.all([
      Product.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 }),
      Product.countDocuments()
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET api/products/liked
// @desc    Get all liked products for current user
// @access  Private
router.get('/liked', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'likedProducts',
      populate: { path: 'owner', select: 'name email' }
    });
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.json(user.likedProducts);
  } catch (err) {
    next(err);
  }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post('/', auth, async (req, res, next) => {
  const { name, price, imageUrl, description } = req.body;

  if (!name || !price || !imageUrl || !description) {
    return next(new AppError('All fields are required', 400));
  }

  if (!validatePrice(price)) {
    return next(new AppError('Price must be a valid positive number', 400));
  }

  try {
    const product = new Product({
      name,
      price: parseFloat(price),
      imageUrl,
      description,
      owner: req.user.id
    });

    await product.save();
    await product.populate('owner', 'name email');
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res, next) => {
  const { name, price, imageUrl, description } = req.body;

  if (!name || !price || !imageUrl || !description) {
    return next(new AppError('All fields are required', 400));
  }

  if (!validatePrice(price)) {
    return next(new AppError('Price must be a valid positive number', 400));
  }

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }


    product.name = name;
    product.price = parseFloat(price);
    product.imageUrl = imageUrl;
    product.description = description;

    await product.save();
    await product.populate('owner', 'name email');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
  try {
    // Atomic operation checks ownership and deletes to prevent race condition
    const product = await Product.findOneAndDelete({
      _id: req.params.id
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// @route   POST api/products/:id/like
// @desc    Like or unlike a product
// @access  Private
router.post('/:id/like', auth, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const index = user.likedProducts.indexOf(product._id);
    let isLiked = false;
    if (index >= 0) {
      user.likedProducts.splice(index, 1);
      isLiked = false;
    } else {
      user.likedProducts.push(product._id);
      isLiked = true;
    }

    await user.save();
    res.json({ isLiked, likedProducts: user.likedProducts });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
