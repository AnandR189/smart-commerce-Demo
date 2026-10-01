import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Zap } from 'lucide-react';
import { useShop } from '../App';

const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;
const discount = (orig, curr) => Math.round(((orig - curr) / orig) * 100);

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted, openCart } = useShop();
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    setTimeout(() => {
      setAdding(false);
      openCart();
    }, 500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const badgeColors = {
    accent: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
    success: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
    warning: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  };

  const badgeStyle = product.badge ? (badgeColors[product.badgeType] || badgeColors.accent) : null;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        className="card"
        style={{ overflow: 'hidden', cursor: 'pointer' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-surface-2)' }}>
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <Zap size={40} />
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <div style={{ position: 'absolute', top: 12, left: 12 }}>
              <span style={{ ...badgeStyle, padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, border: `1px solid ${badgeStyle.border}`, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                {product.badge}
              </span>
            </div>
          )}

          {/* Discount */}
          {product.originalPrice && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#ef4444', color: 'white', padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
              -{discount(product.originalPrice, product.price)}%
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            style={{
              position: 'absolute', bottom: 12, right: 12,
              width: 36, height: 36, borderRadius: '50%',
              background: wishlisted ? 'rgba(239,68,68,0.15)' : 'rgba(10,10,15,0.6)',
              backdropFilter: 'blur(8px)',
              border: wishlisted ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <Heart size={15} color={wishlisted ? '#ef4444' : 'white'} fill={wishlisted ? '#ef4444' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
            {product.category}
          </p>
          <h3 style={{ color: 'var(--color-text-primary)', fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} fill={i <= Math.round(product.rating) ? '#f59e0b' : 'none'} color={i <= Math.round(product.rating) ? '#f59e0b' : 'var(--color-text-muted)'} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{product.rating} ({product.reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Outfit', color: 'var(--color-text-primary)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {adding ? (
              <>Added ✓</>
            ) : (
              <><ShoppingCart size={15} /> Add to Cart</>
            )}
          </button>
        </div>
      </article>
    </Link>
  );
}
