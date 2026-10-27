import { useEffect, useRef } from 'react';
import { useBakery } from '../context/BakeryContext';

export default function SearchModal() {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    addToCart,
  } = useBakery();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isSearchModalOpen) return undefined;
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [isSearchModalOpen]);

  return (
    <div
      className={`modal-backdrop ${isSearchModalOpen ? 'open' : ''}`}
      onClick={(event) => { if (event.target === event.currentTarget) setIsSearchModalOpen(false); }}
      aria-hidden={!isSearchModalOpen}
    >
      <div className="modal-card search-modal-card" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
        <div className="modal-header">
          <h3 id="search-modal-title">Search Delicacies</h3>
          <button className="modal-close-btn" onClick={() => setIsSearchModalOpen(false)} type="button" aria-label="Close search">&times;</button>
        </div>
        <div className="modal-body">
          <div className="search-input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search brownies, truffle cakes, croissants..."
            />
          </div>
          <div className="quick-tags">
            <span>Popular:</span>
            {['Overload', 'Cheesecake', 'Eggless', 'Truffle'].map((tag) => (
              <button key={tag} className="quick-tag" onClick={() => setSearchQuery(tag)} type="button">{tag}</button>
            ))}
          </div>
          <div className="search-results-list">
            {searchQuery && searchResults.length === 0 && (
              <p style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No bakery items found for “{searchQuery}”.</p>
            )}
            {searchResults.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '8px 12px', background: '#FFF9F5', borderRadius: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div>
                    <strong style={{ fontSize: '0.88rem', display: 'block' }}>{item.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary-accent)', fontWeight: 600 }}>₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button className="btn-sm btn-primary" onClick={() => addToCart(item)} type="button">Add</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
