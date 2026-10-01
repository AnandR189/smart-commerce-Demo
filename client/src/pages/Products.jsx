import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Heart } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import ProductGrid from '../components/ProductGrid';
import { useShop } from '../App';

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlistItems } = useShop();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [showWishlist, setShowWishlist] = useState(searchParams.get('wishlist') === 'true');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync search param
  useEffect(() => {
    const s = searchParams.get('search');
    if (s) setSearch(s);
    const c = searchParams.get('category');
    if (c) setCategory(c);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = showWishlist
      ? wishlistItems
      : products;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (category && !showWishlist) {
      list = list.filter(p => p.category === category);
    }

    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
      case 'reviews': return [...list].sort((a, b) => b.reviews - a.reviews);
      default: return list;
    }
  }, [search, category, sort, priceRange, showWishlist, wishlistItems]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPriceRange([0, 30000]);
    setSort('default');
    setShowWishlist(false);
    setSearchParams({});
  };

  const activeFilters = [
    search && `Search: "${search}"`,
    category && `Category: ${category}`,
    showWishlist && 'Wishlist',
  ].filter(Boolean);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="section-title" style={{ marginBottom: 6 }}>
          {showWishlist ? 'Your Wishlist' : category ? categories.find(c => c.id === category)?.name || 'Products' : 'All Products'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            className="input"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input"
          style={{ flex: '0 1 180px', cursor: 'pointer' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input"
          style={{ flex: '0 1 180px', cursor: 'pointer' }}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Wishlist toggle */}
        <button
          onClick={() => setShowWishlist(v => !v)}
          className={showWishlist ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          <Heart size={15} fill={showWishlist ? 'white' : 'none'} />
          Wishlist
        </button>

        {/* Clear */}
        {activeFilters.length > 0 && (
          <button onClick={clearFilters} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Price range */}
      <div style={{ marginBottom: 24, padding: '16px 20px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Price Range
          </label>
          <span style={{ fontSize: 13, color: '#818cf8', fontWeight: 700 }}>
            ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={30000}
          step={500}
          value={priceRange[1]}
          onChange={e => setPriceRange([0, parseInt(e.target.value)])}
          style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
        />
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {activeFilters.map(f => (
            <span key={f} className="badge badge-accent">{f}</span>
          ))}
        </div>
      )}

      {/* Products */}
      <ProductGrid products={filtered} emptyMessage={showWishlist ? 'Your wishlist is empty' : 'No products match your filters'} />
    </div>
  );
}
