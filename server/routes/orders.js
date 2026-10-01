const router = require('express').Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { customer, items, total, shipping, userId } = req.body;
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data' });
    }
    const order = await Order.create({
      user: userId || null,
      customer,
      items,
      total,
      shipping,
    });
    console.log(`📦 New order: ${order._id} — ₹${order.total}`);
    res.status(201).json({ data: order, message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders  (my orders — auth required)
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ data: orders, total: orders.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
