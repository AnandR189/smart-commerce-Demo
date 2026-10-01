require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const productData = [
  {
    name: 'SonicPro ANC Headphones', slug: 'sonicpro-anc-headphones',
    category: 'audio', price: 12999, originalPrice: 17999,
    rating: 4.7, reviews: 2341, badge: 'Best Seller', badgeType: 'accent',
    inStock: true, featured: true, trending: true,
    tags: ['headphones', 'anc', 'wireless', 'premium'],
    bundleTags: ['audio', 'headphones'],
    description: 'Experience studio-quality sound with industry-leading active noise cancellation. 40-hour battery life, ultra-comfortable memory foam ear cushions.',
    highlights: ['40-hour battery life', 'Industry-leading ANC', 'Hi-Res Audio certified', '30-minute quick charge = 5 hours'],
    specs: new Map([['Driver Size', '40mm Dynamic'], ['Frequency Response', '20Hz – 20kHz'], ['Battery Life', '40 hours (ANC on)'], ['Connectivity', 'Bluetooth 5.3, 3.5mm'], ['Weight', '250g'], ['Warranty', '2 years']]),
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80'],
    delivery: '2–3 business days', returnPolicy: '30-day easy return',
    confidence: { score: 94, valueScore: 92, sentimentScore: 96, reviewSummary: 'Positive', deliveryConfidence: 98, returnFriendly: true, productMatch: 'Strong battery life, superior noise cancellation, and competitive pricing.' },
  },
  {
    name: 'TactileX Pro Keyboard', slug: 'tactilex-pro-keyboard',
    category: 'input', price: 8499, originalPrice: 10999,
    rating: 4.6, reviews: 1876, badge: 'Top Rated', badgeType: 'success',
    inStock: true, featured: true, trending: false,
    tags: ['keyboard', 'mechanical', 'wireless', 'productivity'],
    bundleTags: ['keyboard', 'input'],
    description: 'Precision mechanical switches meet minimalist design. Hot-swappable switches, wireless tri-mode connectivity, per-key RGB.',
    highlights: ['Hot-swappable switches', 'Tri-mode wireless', 'Per-key RGB', '3000mAh battery'],
    specs: new Map([['Switch Type', 'Gateron G Pro Red'], ['Layout', 'TKL (80%)'], ['Connectivity', 'BT 5.0, 2.4G, USB-C'], ['Battery', '3000mAh'], ['Backlighting', 'Per-key RGB'], ['Warranty', '1 year']]),
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'],
    delivery: '3–4 business days', returnPolicy: '30-day easy return',
    confidence: { score: 91, valueScore: 89, sentimentScore: 93, reviewSummary: 'Positive', deliveryConfidence: 96, returnFriendly: true, productMatch: 'Hot-swappable design and robust wireless connectivity at a competitive price.' },
  },
  {
    name: 'NexWatch Ultra S2', slug: 'nexwatch-ultra-s2',
    category: 'wearables', price: 21999, originalPrice: 27999,
    rating: 4.8, reviews: 3142, badge: 'New Arrival', badgeType: 'warning',
    inStock: true, featured: true, trending: true,
    tags: ['smartwatch', 'wearable', 'fitness', 'health'],
    bundleTags: ['wearables'],
    description: 'Advanced health monitoring with ECG, SpO2, and stress tracking. Titanium case, sapphire crystal glass, and 18-day battery.',
    highlights: ['18-day battery', 'ECG + SpO2 + Stress', 'Titanium case', 'Always-on display'],
    specs: new Map([['Display', '1.92" AMOLED Always-On'], ['Battery Life', '18 days'], ['Sensors', 'ECG, SpO2, Heart Rate, GPS'], ['Case Material', 'Titanium'], ['Water Resistance', '10 ATM'], ['Warranty', '2 years']]),
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
    delivery: '1–2 business days', returnPolicy: '30-day easy return',
    confidence: { score: 97, valueScore: 95, sentimentScore: 98, reviewSummary: 'Exceptional', deliveryConfidence: 99, returnFriendly: true, productMatch: 'Exceptional health tracking and titanium build quality.' },
  },
  {
    name: 'SwiftMove Pro Mouse', slug: 'swiftmove-pro-mouse',
    category: 'input', price: 5299, originalPrice: 6999,
    rating: 4.5, reviews: 1543, badge: null, badgeType: null,
    inStock: true, featured: false, trending: true,
    tags: ['mouse', 'wireless', 'ergonomic', 'productivity'],
    bundleTags: ['mouse', 'input'],
    description: '8K DPI optical mouse with 90-day battery life and whisper-quiet clicks. Designed for extended work sessions.',
    highlights: ['8K DPI optical sensor', '90-day battery', 'Whisper-quiet clicks', 'USB-C charging'],
    specs: new Map([['Sensor', '8000 DPI Optical'], ['Connectivity', 'Bluetooth 5.2, 2.4G'], ['Battery Life', '90 days'], ['Buttons', '7 programmable'], ['Weight', '101g'], ['Warranty', '1 year']]),
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80'],
    delivery: '2–3 business days', returnPolicy: '30-day easy return',
    confidence: { score: 88, valueScore: 86, sentimentScore: 90, reviewSummary: 'Positive', deliveryConfidence: 95, returnFriendly: true, productMatch: 'High-precision sensor and impressive battery life for productivity users.' },
  },
  {
    name: 'BassCore Mini Speaker', slug: 'basscore-mini-speaker',
    category: 'audio', price: 4999, originalPrice: 6499,
    rating: 4.4, reviews: 987, badge: null, badgeType: null,
    inStock: true, featured: false, trending: true,
    tags: ['speaker', 'bluetooth', 'portable', 'audio'],
    bundleTags: ['speaker', 'audio'],
    description: '360° immersive sound in a compact, waterproof design. IP67 water resistance and 24-hour playtime.',
    highlights: ['360° Immersive Sound', '24-hour playtime', 'IP67 waterproof', 'Dual stereo pairing'],
    specs: new Map([['Driver', '45mm + Passive Radiator'], ['Battery', '5200mAh'], ['Playtime', '24 hours'], ['Water Rating', 'IP67'], ['Connectivity', 'Bluetooth 5.1'], ['Warranty', '1 year']]),
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],
    delivery: '2–4 business days', returnPolicy: '30-day easy return',
    confidence: { score: 85, valueScore: 88, sentimentScore: 83, reviewSummary: 'Positive', deliveryConfidence: 92, returnFriendly: true, productMatch: 'Exceptional waterproof rating and rich sound quality.' },
  },
  {
    name: 'NexHub Pro 12-in-1', slug: 'nexhub-pro-12-in-1',
    category: 'accessories', price: 6799, originalPrice: 8999,
    rating: 4.6, reviews: 2109, badge: "Editor's Pick", badgeType: 'accent',
    inStock: true, featured: false, trending: false,
    tags: ['hub', 'usbc', 'accessories', 'workspace'],
    bundleTags: ['hub', 'accessories'],
    description: '12-in-1 USB-C hub with 100W PD passthrough, 4K HDMI, dual USB-A 3.0, SD/MicroSD reader, and Gigabit Ethernet.',
    highlights: ['100W PD passthrough', '4K@60Hz HDMI', 'Dual USB-A 3.0', 'Gigabit Ethernet'],
    specs: new Map([['Ports', '12 total'], ['Power Delivery', '100W PD'], ['HDMI', '4K@60Hz'], ['USB-A', '3x USB 3.0 (5Gbps)'], ['Card Reader', 'SD + MicroSD'], ['Warranty', '1 year']]),
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80'],
    delivery: '2–3 business days', returnPolicy: '30-day easy return',
    confidence: { score: 90, valueScore: 93, sentimentScore: 88, reviewSummary: 'Positive', deliveryConfidence: 97, returnFriendly: true, productMatch: 'Most comprehensive connectivity solution.' },
  },
  {
    name: 'ElevateX Laptop Stand', slug: 'elevatex-laptop-stand',
    category: 'accessories', price: 3299, originalPrice: 4499,
    rating: 4.5, reviews: 876, badge: null, badgeType: null,
    inStock: true, featured: false, trending: false,
    tags: ['stand', 'laptop', 'accessories', 'workspace', 'ergonomic'],
    bundleTags: ['stand', 'workspace'],
    description: 'Premium aluminum laptop stand with 8-level height adjustment. Supports up to 20kg, folds completely flat.',
    highlights: ['8-level height adjustment', '20kg load capacity', 'Folds completely flat', 'Aircraft-grade aluminum'],
    specs: new Map([['Material', 'Aircraft-grade Aluminum'], ['Height Range', '8 adjustable levels'], ['Max Load', '20kg'], ['Compatibility', '11–17" laptops'], ['Fold', 'Fully foldable'], ['Warranty', '2 years']]),
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80'],
    delivery: '3–5 business days', returnPolicy: '30-day easy return',
    confidence: { score: 87, valueScore: 90, sentimentScore: 85, reviewSummary: 'Positive', deliveryConfidence: 93, returnFriendly: true, productMatch: 'Premium materials and ergonomic design.' },
  },
  {
    name: 'CrystalView 4K Webcam', slug: 'crystalview-4k-webcam',
    category: 'accessories', price: 9499, originalPrice: 12999,
    rating: 4.7, reviews: 1234, badge: 'New', badgeType: 'success',
    inStock: true, featured: false, trending: true,
    tags: ['webcam', 'streaming', '4k', 'accessories'],
    bundleTags: ['webcam', 'streaming'],
    description: '4K 30fps webcam with Sony sensor, AI-powered auto-framing, HDR, and dual omnidirectional microphones.',
    highlights: ['4K 30fps Sony sensor', 'AI auto-framing', 'HDR support', 'Dual noise-cancelling mics'],
    specs: new Map([['Resolution', '4K 30fps / 1080p 60fps'], ['Sensor', 'Sony 1/2.8"'], ['Field of View', '90° adjustable'], ['Microphone', 'Dual omnidirectional'], ['Focus', 'AI autofocus'], ['Warranty', '1 year']]),
    image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&q=80'],
    delivery: '2–3 business days', returnPolicy: '30-day easy return',
    confidence: { score: 92, valueScore: 90, sentimentScore: 94, reviewSummary: 'Highly Positive', deliveryConfidence: 97, returnFriendly: true, productMatch: 'Sony sensor quality and AI-powered framing for professionals.' },
  },
  {
    name: 'FitBand Pro X', slug: 'fitband-pro-x',
    category: 'wearables', price: 6999, originalPrice: 8999,
    rating: 4.3, reviews: 2567, badge: null, badgeType: null,
    inStock: true, featured: false, trending: false,
    tags: ['fitness', 'band', 'wearable', 'health'],
    bundleTags: ['fitness', 'wearables'],
    description: 'Advanced fitness tracker with built-in GPS, 24/7 heart rate monitoring, and 14-day battery.',
    highlights: ['Built-in GPS', '14-day battery', '50m water resistance', 'SpO2 + stress monitor'],
    specs: new Map([['Display', '1.57" AMOLED'], ['Battery', '14 days'], ['GPS', 'Built-in GPS'], ['Sensors', 'HR, SpO2, Stress, Temp'], ['Water Resistance', '5ATM / 50m'], ['Warranty', '1 year']]),
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80'],
    delivery: '2–4 business days', returnPolicy: '30-day easy return',
    confidence: { score: 83, valueScore: 85, sentimentScore: 81, reviewSummary: 'Positive', deliveryConfidence: 91, returnFriendly: true, productMatch: 'Comprehensive fitness tracking and long battery life.' },
  },
  {
    name: 'TrueAir 3 Pro Earbuds', slug: 'trueair-3-pro-earbuds',
    category: 'audio', price: 7999, originalPrice: 10499,
    rating: 4.6, reviews: 3401, badge: 'Hot Deal', badgeType: 'warning',
    inStock: true, featured: true, trending: true,
    tags: ['earbuds', 'wireless', 'anc', 'audio'],
    bundleTags: ['earbuds', 'audio'],
    description: 'True wireless earbuds with adaptive ANC, 30-hour total playtime, and wireless charging.',
    highlights: ['Adaptive ANC', '30hr total playtime', 'Wireless charging case', 'IPX5 water resistance'],
    specs: new Map([['Driver', '11mm + 6mm dual driver'], ['Battery', '8h (ANC on) + 22h case'], ['ANC', 'Adaptive Hybrid ANC'], ['Connectivity', 'Bluetooth 5.3'], ['Charging', 'USB-C + Wireless'], ['Warranty', '1 year']]),
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'],
    delivery: '1–2 business days', returnPolicy: '30-day easy return',
    confidence: { score: 93, valueScore: 91, sentimentScore: 95, reviewSummary: 'Highly Positive', deliveryConfidence: 99, returnFriendly: true, productMatch: 'Adaptive noise cancellation and dual-driver audio.' },
  },
  {
    name: 'DeskPad XL ProSkin', slug: 'deskpad-xl-proskin',
    category: 'accessories', price: 1799, originalPrice: 2499,
    rating: 4.5, reviews: 4221, badge: null, badgeType: null,
    inStock: true, featured: false, trending: false,
    tags: ['deskpad', 'mousepad', 'workspace', 'accessories'],
    bundleTags: ['deskpad', 'workspace'],
    description: 'Extra-large premium desk mat with micro-textured surface, stitched edges, and non-slip rubber base.',
    highlights: ['900×400mm XL size', 'Micro-textured surface', 'Anti-fray stitched edges', 'Non-slip rubber base'],
    specs: new Map([['Size', '900 × 400 × 4mm'], ['Surface', 'Micro-textured fabric'], ['Base', 'Natural rubber'], ['Edges', 'Machine stitched'], ['Washable', 'Yes'], ['Warranty', '6 months']]),
    image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80'],
    delivery: '3–5 business days', returnPolicy: '30-day easy return',
    confidence: { score: 86, valueScore: 92, sentimentScore: 84, reviewSummary: 'Positive', deliveryConfidence: 90, returnFriendly: true, productMatch: 'Superior surface texture and generous dimensions.' },
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Seed products (upsert by slug — won't overwrite existing)
    let created = 0, updated = 0;
    for (const data of productData) {
      const existing = await Product.findOne({ slug: data.slug });
      if (!existing) {
        const product = new Product(data);
        await product.save(); // triggers pre-save for price history
        created++;
      } else {
        // Update fields but preserve priceHistory
        await Product.updateOne({ slug: data.slug }, {
          $set: {
            name: data.name, category: data.category, price: data.price,
            originalPrice: data.originalPrice, rating: data.rating, reviews: data.reviews,
            badge: data.badge, badgeType: data.badgeType, inStock: data.inStock,
            featured: data.featured, trending: data.trending, tags: data.tags,
            bundleTags: data.bundleTags, description: data.description,
            highlights: data.highlights, image: data.image, images: data.images,
            delivery: data.delivery, returnPolicy: data.returnPolicy, confidence: data.confidence,
          }
        });
        updated++;
      }
    }
    console.log(`✅ Products: ${created} created, ${updated} updated (price history preserved)`);

    // Seed demo users (only if they don't exist)
    const adminExists = await User.findOne({ email: 'admin@smartcommerce.com' });
    if (!adminExists) {
      const adminPass = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin User', email: 'admin@smartcommerce.com', password: adminPass, role: 'admin' });
      console.log('✅ Created admin user (admin@smartcommerce.com / admin123)');
    } else {
      console.log('ℹ️  Admin user already exists, skipped');
    }

    const demoExists = await User.findOne({ email: 'demo@smartcommerce.com' });
    if (!demoExists) {
      const userPass = await bcrypt.hash('user123', 10);
      await User.create({ name: 'Demo User', email: 'demo@smartcommerce.com', password: userPass, role: 'user' });
      console.log('✅ Created demo user (demo@smartcommerce.com / user123)');
    } else {
      console.log('ℹ️  Demo user already exists, skipped');
    }

    console.log('\n🚀 Seed complete! Your existing MongoDB data was NOT deleted.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
