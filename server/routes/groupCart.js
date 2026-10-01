const router = require('express').Router();
const GroupCart = require('../models/GroupCart');
const { protect } = require('../middleware/auth');

// POST /api/group-carts — Create a new group cart
router.post('/', protect, async (req, res) => {
  try {
    const { name } = req.body;
    const cart = await GroupCart.create({
      name: name || `${req.user.name}'s Group Cart`,
      owner: req.user._id,
      ownerName: req.user.name,
      members: [{ userId: req.user._id, name: req.user.name }],
    });
    res.status(201).json({ data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/group-carts/:code — Get cart by invite code (polling endpoint)
router.get('/:code', async (req, res) => {
  try {
    const cart = await GroupCart.findOne({ inviteCode: req.params.code }).lean();
    if (!cart) return res.status(404).json({ error: 'Group cart not found' });
    res.json({ data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/group-carts/:code/join — Join a group cart
router.post('/:code/join', protect, async (req, res) => {
  try {
    const cart = await GroupCart.findOne({ inviteCode: req.params.code });
    if (!cart) return res.status(404).json({ error: 'Group cart not found' });
    if (cart.status !== 'open') return res.status(400).json({ error: 'Cart is no longer open' });
    // Check if already member
    const alreadyMember = cart.members.some(m => m.userId.toString() === req.user._id.toString());
    if (!alreadyMember) {
      cart.members.push({ userId: req.user._id, name: req.user.name });
      await cart.save();
    }
    res.json({ data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/group-carts/:code/items — Add item to group cart
router.post('/:code/items', protect, async (req, res) => {
  try {
    const { productId, name, price, image, quantity } = req.body;
    const cart = await GroupCart.findOne({ inviteCode: req.params.code });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    if (cart.status !== 'open') return res.status(400).json({ error: 'Cart is locked' });
    cart.items.push({
      productId,
      name,
      price,
      image,
      quantity: quantity || 1,
      addedBy: req.user._id,
      addedByName: req.user.name,
      votes: [],
    });
    await cart.save();
    res.json({ data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/group-carts/:code/items/:itemId — Remove item
router.delete('/:code/items/:itemId', protect, async (req, res) => {
  try {
    const cart = await GroupCart.findOne({ inviteCode: req.params.code });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    // Only owner or item adder can remove
    const isOwner = cart.owner.toString() === req.user._id.toString();
    const isAdder = item.addedBy.toString() === req.user._id.toString();
    if (!isOwner && !isAdder) return res.status(403).json({ error: 'Not authorized' });
    cart.items.pull({ _id: req.params.itemId });
    await cart.save();
    res.json({ data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/group-carts/:code/items/:itemId/vote — Vote on item
router.post('/:code/items/:itemId/vote', protect, async (req, res) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    if (!['up', 'down'].includes(vote)) return res.status(400).json({ error: 'Vote must be up or down' });
    const cart = await GroupCart.findOne({ inviteCode: req.params.code });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    // Remove existing vote from this user
    item.votes = item.votes.filter(v => v.userId.toString() !== req.user._id.toString());
    item.votes.push({ userId: req.user._id, vote });
    await cart.save();
    res.json({ data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/group-carts/:code/lock — Lock cart (owner only)
router.post('/:code/lock', protect, async (req, res) => {
  try {
    const cart = await GroupCart.findOne({ inviteCode: req.params.code });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    if (cart.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can lock the cart' });
    }
    cart.status = 'locked';
    await cart.save();
    res.json({ data: cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/group-carts/my/list — Get my group carts
router.get('/my/list', protect, async (req, res) => {
  try {
    const carts = await GroupCart.find({
      $or: [{ owner: req.user._id }, { 'members.userId': req.user._id }],
    }).sort({ createdAt: -1 }).lean();
    res.json({ data: carts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
