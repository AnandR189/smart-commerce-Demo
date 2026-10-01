import { products } from '../data/products';

// Bundle rules: maps bundleTags to complementary product tags
const bundleRules = {
  headphones: ['stand', 'hub', 'webcam', 'deskpad'],
  audio: ['hub', 'deskpad', 'mouse'],
  earbuds: ['hub', 'stand', 'mouse'],
  keyboard: ['mouse', 'deskpad', 'hub', 'stand'],
  input: ['deskpad', 'hub', 'stand'],
  mouse: ['keyboard', 'deskpad', 'hub'],
  wearables: ['earbuds', 'hub', 'stand'],
  fitness: ['earbuds', 'hub'],
  speaker: ['hub', 'deskpad', 'stand'],
  webcam: ['hub', 'stand', 'keyboard'],
  streaming: ['hub', 'stand', 'mouse'],
  workspace: ['hub', 'mouse', 'keyboard'],
  stand: ['hub', 'keyboard', 'mouse', 'deskpad'],
  hub: ['stand', 'keyboard', 'mouse'],
  accessories: ['keyboard', 'mouse', 'deskpad'],
};

// Reasons for bundle pairing
const pairingReasons = {
  hub: 'Expand connectivity and keep all devices powered seamlessly.',
  stand: 'Ergonomic positioning reduces neck strain during extended sessions.',
  mouse: 'Precision input completes the premium desktop experience.',
  keyboard: 'Tactile feedback elevates productivity and comfort.',
  deskpad: 'Unified workspace surface protects your desk and improves tracking.',
  webcam: 'Professional video presence for meetings and content creation.',
  earbuds: 'Effortless true wireless audio for active listening.',
  speaker: 'Fill your space with immersive, room-filling sound.',
  fitness: 'Track your health while staying connected all day.',
  stand: 'Position your screen at the perfect ergonomic angle.',
};

const getPairingReason = (product) => {
  for (const tag of product.bundleTags) {
    if (pairingReasons[tag]) return pairingReasons[tag];
  }
  return 'A smart addition to elevate your setup.';
};

export const getBundleForProduct = (mainProduct) => {
  if (!mainProduct) return [];

  // Collect candidate tags from this product's bundle rules
  const candidateTags = new Set();
  for (const tag of mainProduct.bundleTags) {
    const targets = bundleRules[tag] || [];
    targets.forEach(t => candidateTags.add(t));
  }

  // Score products by how many candidate tags they match
  const scored = products
    .filter(p => p.id !== mainProduct.id)
    .map(p => {
      const matches = p.bundleTags.filter(t => candidateTags.has(t)).length;
      return { product: p, score: matches };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Pick top 3 unique complement products
  const selected = scored.slice(0, 3).map(s => ({
    ...s.product,
    pairingReason: getPairingReason(s.product),
  }));

  return selected;
};

export const calculateBundlePrice = (mainProduct, bundleItems) => {
  const total = [mainProduct, ...bundleItems].reduce((sum, p) => sum + p.price, 0);
  const discount = Math.floor(total * 0.12); // 12% bundle discount
  return {
    total,
    bundlePrice: total - discount,
    savings: discount,
    savingsPercent: 12,
  };
};
