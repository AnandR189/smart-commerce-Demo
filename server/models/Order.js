const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = guest
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  total: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
