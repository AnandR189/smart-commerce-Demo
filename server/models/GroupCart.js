const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vote: { type: String, enum: ['up', 'down'] },
}, { _id: false });

const groupCartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // can be string or ObjectId
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addedByName: String,
  votes: [voteSchema],
}, { timestamps: true });

const groupCartSchema = new mongoose.Schema({
  inviteCode: { type: String, unique: true, default: () => uuidv4().slice(0, 8).toUpperCase() },
  name: { type: String, default: 'Group Cart' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: String,
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    joinedAt: { type: Date, default: Date.now },
  }],
  items: [groupCartItemSchema],
  status: { type: String, enum: ['open', 'locked', 'checked_out'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('GroupCart', groupCartSchema);
