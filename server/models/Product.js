const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  badge: { type: String },
  badgeType: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  tags: [{ type: String }],
  bundleTags: [{ type: String }],
  description: { type: String },
  highlights: [{ type: String }],
  specs: { type: Map, of: String },
  image: { type: String },
  images: [{ type: String }],
  delivery: { type: String, default: '2–4 business days' },
  returnPolicy: { type: String, default: '30-day easy return' },
  confidence: {
    score: { type: Number, default: 85 },
    valueScore: { type: Number, default: 85 },
    sentimentScore: { type: Number, default: 85 },
    reviewSummary: { type: String, default: 'Positive' },
    deliveryConfidence: { type: Number, default: 90 },
    returnFriendly: { type: Boolean, default: true },
    productMatch: { type: String },
  },
  // Price Memory
  priceHistory: [priceHistorySchema],
}, { timestamps: true });

// On pre-save, if it's a new doc, generate 30-day price history
productSchema.pre('save', async function() {
  if (this.isNew && (!this.priceHistory || this.priceHistory.length === 0)) {
    const history = [];
    const now = Date.now();
    for (let i = 29; i >= 1; i--) {
      const variation = (Math.random() - 0.3) * 0.12;
      history.push({
        price: Math.round(this.price * (1 + variation)),
        date: new Date(now - i * 24 * 60 * 60 * 1000),
      });
    }
    history.push({ price: this.price, date: new Date() });
    this.priceHistory = history;
  }
});

module.exports = mongoose.model('Product', productSchema);
