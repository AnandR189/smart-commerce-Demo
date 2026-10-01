require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const groupCartRoutes = require('./routes/groupCart');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ─── Connect MongoDB ───
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Running in offline mode with no DB');
  });

// ─── Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/group-carts', groupCartRoutes);

// Categories (static — same as frontend)
app.get('/api/categories', (req, res) => {
  res.json({
    data: [
      { id: 'audio', name: 'Audio', description: 'Headphones, speakers & more', icon: '🎧' },
      { id: 'input', name: 'Input Devices', description: 'Keyboards, mice & peripherals', icon: '⌨️' },
      { id: 'wearables', name: 'Wearables', description: 'Smart watches & fitness', icon: '⌚' },
      { id: 'accessories', name: 'Accessories', description: 'Hubs, stands & workspace gear', icon: '🔌' },
    ],
  });
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
🚀 SmartCommerce API → http://localhost:${PORT}

   Auth:         POST /api/auth/register | /login | GET /api/auth/me
   Products:     GET  /api/products      | /api/products/:id
   Price Update: PUT  /api/products/:id/price   (admin)
   Price Watch:  POST /api/products/:id/watch   (auth)
   Orders:       POST /api/orders
   Group Carts:  POST /api/group-carts   | GET /:code | POST /:code/join
   `);
});
