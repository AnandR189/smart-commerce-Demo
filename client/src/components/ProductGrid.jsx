import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, emptyMessage = 'No products found' }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card" style={{ overflow: 'hidden' }}>
            <div className="shimmer" style={{ aspectRatio: '4/3' }} />
            <div style={{ padding: 16 }}>
              <div className="shimmer" style={{ height: 12, borderRadius: 6, marginBottom: 8, width: '40%' }} />
              <div className="shimmer" style={{ height: 16, borderRadius: 6, marginBottom: 12, width: '80%' }} />
              <div className="shimmer" style={{ height: 12, borderRadius: 6, marginBottom: 12, width: '60%' }} />
              <div className="shimmer" style={{ height: 40, borderRadius: 10 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h3 style={{ color: 'var(--color-text-primary)', fontFamily: 'Outfit', fontSize: 22, marginBottom: 8 }}>
          {emptyMessage}
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
