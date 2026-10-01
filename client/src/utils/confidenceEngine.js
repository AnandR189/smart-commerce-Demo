// Deterministic confidence scoring engine
// Scores are stored per-product in data/products.js confidence object
// This engine formats and enriches the data for display

export const getConfidenceData = (product) => {
  if (!product?.confidence) return null;

  const c = product.confidence;

  return {
    overallScore: c.score,
    valueScore: c.valueScore,
    sentimentScore: c.sentimentScore,
    deliveryConfidence: c.deliveryConfidence,
    returnFriendly: c.returnFriendly,
    reviewSummary: c.reviewSummary,
    productMatch: c.productMatch,
    delivery: product.delivery,
    returnPolicy: product.returnPolicy,
    rating: product.rating,
    reviews: product.reviews,
    scoreLabel: getScoreLabel(c.score),
    scoreColor: getScoreColor(c.score),
  };
};

export const getScoreLabel = (score) => {
  if (score >= 95) return 'Exceptional';
  if (score >= 88) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  return 'Fair';
};

export const getScoreColor = (score) => {
  if (score >= 90) return '#10b981'; // emerald
  if (score >= 78) return '#6366f1'; // indigo
  if (score >= 65) return '#f59e0b'; // amber
  return '#ef4444'; // red
};

export const getStarRating = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return { full, half, empty: 5 - full - (half ? 1 : 0) };
};
