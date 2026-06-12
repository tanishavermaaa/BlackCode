const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Helper to validate price
const validatePrice = (price) => {
  const p = parseFloat(price);
  return !isNaN(p) && p > 0;
};

// @route   GET api/products
// @desc    Get all products
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching products');
  }
});

// @route   GET api/products/liked
// @desc    Get all liked products for current user
// @access  Private
router.get('/liked', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'likedProducts',
      populate: { path: 'owner', select: 'name email' }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.likedProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching liked products');
  }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, price, imageUrl, description } = req.body;

  // Validate fields
  if (!name || !price || !imageUrl || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!validatePrice(price)) {
    return res.status(400).json({ message: 'Price must be a valid positive number' });
  }

  try {
    const newProduct = new Product({
      name,
      price: parseFloat(price),
      imageUrl,
      description,
      owner: req.user.id
    });

    const product = await newProduct.save();
    const populatedProduct = await Product.findById(product._id).populate('owner', 'name email');
    res.status(201).json(populatedProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error creating product');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, price, imageUrl, description } = req.body;

  // Validate fields
  if (!name || !price || !imageUrl || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!validatePrice(price)) {
    return res.status(400).json({ message: 'Price must be a valid positive number' });
  }

  try {
    let product = await Product.findById(req.id || req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.name = name;
    product.price = parseFloat(price);
    product.imageUrl = imageUrl;
    product.description = description;

    await product.save();
    const populatedProduct = await Product.findById(product._id).populate('owner', 'name email');
    res.json(populatedProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error updating product');
  }
});

// @route   POST api/products/:id/like
// @desc    Like or unlike a product
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.likedProducts.indexOf(product._id);
    let isLiked = false;
    if (index >= 0) {
      // Already liked, so unlike
      user.likedProducts.splice(index, 1);
      isLiked = false;
    } else {
      // Not liked yet, so like
      user.likedProducts.push(product._id);
      isLiked = true;
    }

    await user.save();
    res.json({ isLiked, likedProducts: user.likedProducts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error toggling product like');
  }
});

module.exports = router;
