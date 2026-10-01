const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, featured, trending } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (trending === 'true') filter.trending = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }
    let query = Product.find(filter);
    if (sort === 'price-asc') query = query.sort({ price: 1 });
    else if (sort === 'price-desc') query = query.sort({ price: -1 });
    else if (sort === 'rating') query = query.sort({ rating: -1 });
    else if (sort === 'reviews') query = query.sort({ reviews: -1 });
    const products = await query.lean();
    res.json({ data: products, total: products.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id/price  — Admin: update price (appends to priceHistory)
router.put('/:id/price', protect, adminOnly, async (req, res) => {
  try {
    const { price } = req.body;
    if (!price || price <= 0) return res.status(400).json({ error: 'Valid price required' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.priceHistory.push({ price: product.price, date: new Date() });
    product.price = Number(price);
    await product.save({ validateBeforeSave: false });
    res.json({ data: product, message: 'Price updated and history logged' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/:id/watch  — Add to price watch list
router.post('/:id/watch', protect, async (req, res) => {
  try {
    const { targetPrice } = req.body;
    if (!targetPrice || targetPrice <= 0) return res.status(400).json({ error: 'Valid target price required' });
    const user = await User.findById(req.user._id);
    // Remove existing watch for this product
    user.priceWatches = user.priceWatches.filter(
      w => w.productId.toString() !== req.params.id
    );
    user.priceWatches.push({ productId: req.params.id, targetPrice: Number(targetPrice), notified: false });
    await user.save();
    res.json({ message: 'Price watch added', watches: user.priceWatches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id/watch — Remove price watch
router.delete('/:id/watch', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.priceWatches = user.priceWatches.filter(
      w => w.productId.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Price watch removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/check-alerts  — Check price alerts for current user
router.get('/user/alerts', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('priceWatches.productId', 'name price image');
    const triggered = user.priceWatches.filter(w => {
      const currentPrice = w.productId?.price;
      return currentPrice && currentPrice <= w.targetPrice;
    });
    res.json({ alerts: triggered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
