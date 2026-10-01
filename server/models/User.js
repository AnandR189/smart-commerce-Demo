const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // Price watch list
  priceWatches: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    targetPrice: { type: Number, required: true },
    notified: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
