import { useBakery } from '../context/BakeryContext';
import ProductCard from './ProductCard';

const CATEGORY_TITLES = {
  all: 'All Delicacies & Daily Bakes',
  brownies: 'Signature Handcrafted Brownies',
  cakes: 'Speciality Celebration Cakes & Cheesecakes',
  pastries: 'Delicate Pastries & Fruit Tarts',
  teacakes: 'Artisanal Teacakes & Daily Loaves',
  savouries: 'Oven-Warm Savouries & Puffs',
  gifting: 'Luxury Hampers & Gift Boxes',
};

export default function ProductsSection() {
  const {
    filteredProducts,
    loading,
    loadError,
    currentCategory,
    egglessOnly,
    setEgglessOnly,
    sortBy,
    setSortBy,
    resetFilters,
    refreshCatalog,
  } = useBakery();

  return (
    <section className="section products-section" id="bestsellers">
      <div className="container">
        <div className="section-toolbar">
          <div className="toolbar-left">
            <h3 className="toolbar-title">{CATEGORY_TITLES[currentCategory] || 'Our Menu'}</h3>
            <span className="items-count">
              {loading ? 'Loading items…' : `Showing ${filteredProducts.length} item${filteredProducts.length === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className="toolbar-filters">
            <label className="filter-toggle" title="Show only eggless items">
              <input type="checkbox" checked={egglessOnly} onChange={(event) => setEgglessOnly(event.target.checked)} />
              <span className="toggle-slider" />
              <span className="toggle-label"><span className="veg-dot-icon" /> Eggless Only</span>
            </label>
            <select className="sort-dropdown" value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {loadError && !loading && (
          <div className="empty-cart-state" role="alert">
            <h4>Could not load products</h4>
            <p>{loadError}. Check that the backend is running and GET /api/products is available.</p>
            <button className="btn btn-secondary" onClick={refreshCatalog} type="button">Try Again</button>
          </div>
        )}

        <div className="products-grid">
          {loading ? (
            <p className="products-loading">Loading bakery items…</p>
          ) : filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', background: '#FFF', borderRadius: '14px' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                No baked items found matching your current filter.
              </p>
              <button className="btn btn-secondary" onClick={resetFilters} type="button">Reset Filters</button>
            </div>
          ) : (
            filteredProducts.map((item) => <ProductCard item={item} key={item.id} />)
          )}
        </div>
      </div>
    </section>
  );
}
