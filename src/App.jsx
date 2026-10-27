import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PRODUCTS, GIFT_ITEMS, CITIES } from './data';

const CATEGORY_TITLES = {
  all: 'All Delicacies & Daily Bakes',
  brownies: 'Signature Handcrafted Brownies',
  cakes: 'Speciality Celebration Cakes & Cheesecakes',
  pastries: 'Delicate Pastries & Fruit Tarts',
  teacakes: 'Artisanal Teacakes & Daily Loaves',
  savouries: 'Oven-Warm Savouries & Puffs',
  gifting: 'Luxury Hampers & Gift Boxes'
};

const CATEGORIES = [
  { id: 'all', label: 'All Items', emoji: '🍰' },
  { id: 'brownies', label: 'Brownies', emoji: '🍫' },
  { id: 'cakes', label: 'Cakes & Cheesecakes', emoji: '🎂' },
  { id: 'pastries', label: 'Pastries & Tarts', emoji: '🧁' },
  { id: 'teacakes', label: 'Tea Cakes & Breads', emoji: '🍞' },
  { id: 'savouries', label: 'Savouries & Puffs', emoji: '🥐' },
  { id: 'gifting', label: 'Hampers & Gifting', emoji: '🎁' }
];

export default function App() {
  // State
  const [currentCategory, setCurrentCategory] = useState('all');
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentCity, setCurrentCity] = useState('Mumbai, Bandra West');
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('theo_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [cartBadgeScale, setCartBadgeScale] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const searchInputRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('theo_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Window scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsHeaderScrolled(true);
      } else {
        setIsHeaderScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body overflow locking when drawer/modal open
  useEffect(() => {
    if (isCartOpen || isLocationModalOpen || isSearchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isCartOpen, isLocationModalOpen, isSearchModalOpen]);

  // Focus search input when open
  useEffect(() => {
    if (isSearchModalOpen) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSearchModalOpen]);

  // Show toast notification helper
  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    setIsToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2600);
  };

  // Cart operations
  const addToCart = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    setCartBadgeScale(true);
    setTimeout(() => setCartBadgeScale(false), 200);

    const product = PRODUCTS.find((p) => p.id === productId) || GIFT_ITEMS[productId];
    showToast(`Added "${product ? product.name : 'Item'}" to bag!`);
  };

  const directAddToCart = (giftId) => {
    setCart((prev) => ({
      ...prev,
      [giftId]: (prev[giftId] || 0) + 1
    }));
    setCartBadgeScale(true);
    setTimeout(() => setCartBadgeScale(false), 200);
    showToast('Gift hamper added to your bag!');
    setIsCartOpen(true);
  };

  const updateQty = (productId, delta) => {
    setCart((prev) => {
      const updated = { ...prev };
      const newQty = (updated[productId] || 0) + delta;
      if (newQty <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = newQty;
      }
      return updated;
    });
  };

  // Checkout simulation
  const handleCheckout = () => {
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    if (totalItems === 0) {
      showToast('Your bag is currently empty!');
      return;
    }
    showToast('Redirecting to secure payment gateway...');
    setTimeout(() => {
      alert(`Thank you for ordering with Theobroma!\nOrder placed for ${currentCity}.\nDelivery dispatched.`);
      setCart({});
      setIsCartOpen(false);
    }, 600);
  };

  // Switch category and scroll
  const handleSelectCategory = (catId, scroll = false) => {
    setCurrentCategory(catId);
    if (scroll) {
      const section = document.getElementById('bestsellers');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setEgglessOnly(false);
    setCurrentCategory('all');
    setSortBy('featured');
  };

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (currentCategory !== 'all') {
      list = list.filter((p) => p.category === currentCategory);
    }

    if (egglessOnly) {
      list = list.filter((p) => p.eggless === true);
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [currentCategory, egglessOnly, sortBy]);

  // Cart totals calculations
  const totalItemCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const { subtotal, tax, delivery, total } = useMemo(() => {
    let sub = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const item = PRODUCTS.find((p) => p.id === id) || GIFT_ITEMS[id] || { price: 200 };
      sub += item.price * qty;
    });
    const tx = Math.round(sub * 0.05);
    const del = sub === 0 ? 0 : sub >= 500 ? 0 : 50;
    const tot = sub === 0 ? 0 : sub + tx + del;
    return { subtotal: sub, tax: tx, delivery: del, total: tot };
  }, [cart]);

  // Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const progressPercent = Math.min(100, Math.round((subtotal / 500) * 100));

  return (
    <div className="theobroma-app">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>✨ Treat yourself! Enjoy <strong>15% OFF</strong> on your first order with code <strong>THEO15</strong></span>
          <div className="announcement-links">
            <a href="#stores">Find a Store</a>
            <span>|</span>
            <a href="#track">Track Order</a>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className={`main-header ${isHeaderScrolled ? 'scrolled' : ''}`} id="header">
        <div className="container header-inner">
          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Logo & Tagline */}
          <div className="brand-identity">
            <a href="#" className="brand-logo">
              <span className="logo-script">Theobroma</span>
              <span className="logo-tagline">FOOD OF THE GODS • PATISSERIE</span>
            </a>
          </div>

          {/* City / Location Selector */}
          <div className="location-picker" onClick={() => setIsLocationModalOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div className="location-details">
              <span className="location-label">Delivering to</span>
              <span className="current-city">{currentCity}</span>
            </div>
            <svg className="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {/* Navigation Links */}
          <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <a href="#categories" className="nav-link active" onClick={() => setIsMobileMenuOpen(false)}>Menu</a>
            <a href="#bestsellers" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Best Sellers</a>
            <a href="#speciality-cakes" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Speciality Cakes</a>
            <a href="#gifting" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Gifting & Hampers</a>
            <a href="#story" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Our Story</a>
          </nav>

          {/* Action Icons */}
          <div className="header-actions">
            {/* Search Trigger */}
            <button
              className="action-btn search-trigger"
              onClick={() => setIsSearchModalOpen(true)}
              title="Search delicacies"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Account / Sign In */}
            <button className="action-btn" title="My Account" onClick={() => showToast('Sign In / Profile')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {/* Cart Button with Count Badge */}
            <button className="action-btn cart-btn" onClick={() => setIsCartOpen(true)} title="Shopping Bag">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-badge" style={{ transform: cartBadgeScale ? 'scale(1.25)' : 'scale(1)' }}>
                {totalItemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section Slider / Showcase */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-card">
            <div className="hero-content">
              <div className="badge-pill">Signature Patisserie</div>
              <h1 className="hero-title">Handcrafted Happiness,<br /><em>Freshly Baked</em> Daily</h1>
              <p className="hero-subtitle">
                Indulge in authentic recipes made with pure Belgian chocolate, real dairy butter, and love. From legendary brownies to decadent celebration cakes.
              </p>
              <div className="hero-cta-group">
                <a href="#bestsellers" className="btn btn-primary">
                  <span>Order Online Now</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <a href="#categories" className="btn btn-secondary">Explore Menu</a>
              </div>
              <div className="hero-perks">
                <div className="perk-item">
                  <span className="perk-dot"></span> 60-Min Express Delivery
                </div>
                <div className="perk-item">
                  <span className="perk-dot"></span> 100% Eggless Options
                </div>
                <div className="perk-item">
                  <span className="perk-dot"></span> Authentic Belgian Cocoa
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"
                  alt="Delicious Overload Chocolate Brownies"
                  className="hero-main-img"
                />
                <div className="floating-badge">
                  <span className="badge-icon">🍫</span>
                  <div className="badge-text">
                    <strong>Iconic Brownie</strong>
                    <span>Over 10M+ Slices Sold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP Brand Pillars */}
      <section className="usp-section">
        <div className="container">
          <div className="usp-grid">
            <div className="usp-card">
              <div className="usp-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <h3>Pure Ingredients</h3>
              <p>Real cocoa, creamery butter, and genuine ingredients with zero shortcuts.</p>
            </div>
            <div className="usp-card">
              <div className="usp-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3>Baked Fresh Daily</h3>
              <p>Prepared in small artisanal batches early morning to preserve authentic warmth.</p>
            </div>
            <div className="usp-card">
              <div className="usp-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <h3>Same-Day Doorstep Delivery</h3>
              <p>Delivered safely in temperature-insulated sustainable boxes.</p>
            </div>
            <div className="usp-card">
              <div className="usp-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>Honestly Priced</h3>
              <p>Luxury desserts made accessible for everyday celebrations and tea times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section categories-section" id="categories">
        <div className="container">
          <div className="section-header">
            <span className="sub-heading">Browse By Delicacy</span>
            <h2 className="section-title">Explore Our Menu</h2>
            <p className="section-desc">From our iconic brownies to artisan sourdough and delicate tea-cakes.</p>
          </div>

          <div className="category-slider">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`category-pill ${currentCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleSelectCategory(cat.id)}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid / Best Sellers */}
      <section className="section products-section" id="bestsellers">
        <div className="container">
          <div className="section-toolbar">
            <div className="toolbar-left">
              <h3 className="toolbar-title">{CATEGORY_TITLES[currentCategory] || 'Our Menu'}</h3>
              <span className="items-count">
                Showing {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="toolbar-filters">
              {/* Dietary Filter: Veg / Eggless Toggle */}
              <label className="filter-toggle" title="Show only eggless items">
                <input
                  type="checkbox"
                  checked={egglessOnly}
                  onChange={(e) => setEgglessOnly(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">
                  <span className="veg-dot-icon"></span> Eggless Only
                </span>
              </label>

              <select
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', background: '#FFF', borderRadius: '14px' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  No baked items found matching your current filter.
                </p>
                <button className="btn btn-secondary" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredProducts.map((item) => (
                <article className="product-card" key={item.id}>
                  <div className="product-img-wrap">
                    <img src={item.image} alt={item.name} className="product-img" loading="lazy" />
                    <span className="tag-badge">{item.tag}</span>
                    <div className="diet-indicator" title={item.eggless ? 'Eggless (Vegetarian)' : 'Contains Egg'}>
                      <span className={`diet-dot ${item.eggless ? 'veg' : 'non-veg'}`}></span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h4 className="product-title">{item.name}</h4>
                    <p className="product-desc">{item.desc}</p>
                    <div className="product-meta">
                      <div className="price-box">
                        <span className="price">₹{item.price}</span>
                        <span className="portion">{item.portion}</span>
                      </div>
                      <button className="add-cart-btn" onClick={() => addToCart(item.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>ADD</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Speciality Celebration Cakes Feature Banner */}
      <section className="speciality-banner-section" id="speciality-cakes">
        <div className="container">
          <div className="banner-box">
            <div className="banner-content">
              <span className="banner-badge">Hand-Crafted For Milestones</span>
              <h2 className="banner-title">Make Your Celebrations Extra Special</h2>
              <p className="banner-desc">
                Customised celebration cakes, fresh multi-layered gateaux, and artisanal tier cakes made to order with customized messages and theme decorations.
              </p>
              <div className="banner-actions">
                <button className="btn btn-primary" onClick={() => handleSelectCategory('cakes', true)}>
                  Order Celebration Cakes
                </button>
                <a href="#custom-cake-modal" className="btn btn-outline" onClick={(e) => { e.preventDefault(); showToast('Custom cake requests: Contacting chef...'); }}>
                  Custom Cake Enquiry
                </a>
              </div>
            </div>
            <div className="banner-image">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
                alt="Chocolate Truffle Celebration Cake"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gifting & Hampers Section */}
      <section className="section gifting-section" id="gifting">
        <div className="container">
          <div className="section-header">
            <span className="sub-heading">Thoughtfully Curated</span>
            <h2 className="section-title">Festive & Corporate Gifting</h2>
            <p className="section-desc">Share sweetness with your loved ones and colleagues. Elegant gift tins and custom hampers.</p>
          </div>

          <div className="gifting-grid">
            {Object.values(GIFT_ITEMS).map((gift) => (
              <div className="gifting-card" key={gift.id}>
                <div className="gifting-img-wrap">
                  <img src={gift.image} alt={gift.name} />
                </div>
                <div className="gifting-info">
                  <span className="gift-tag">{gift.tag}</span>
                  <h4>{gift.name}</h4>
                  <p>{gift.desc}</p>
                  <div className="gift-footer">
                    <span className="gift-price">₹{gift.price.toLocaleString('en-IN')}</span>
                    <button className="btn-sm btn-primary" onClick={() => directAddToCart(gift.id)}>
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story / About Us Section */}
      <section className="section story-section" id="story">
        <div className="container story-inner">
          <div className="story-image-column">
            <div className="story-image-stack">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80"
                alt="Bakery Kitchen Artisans"
                className="stack-img-1"
              />
              <div className="story-experience-card">
                <span className="exp-years">20+</span>
                <span className="exp-label">Years of Sweet Memories & Trust</span>
              </div>
            </div>
          </div>
          <div className="story-content-column">
            <span className="sub-heading">Our Heritage</span>
            <h2 className="section-title">Born in Colaba,<br />Loved Across the Country</h2>
            <p className="story-paragraph">
              Theobroma began its journey in 2004 as a humble family-run patisserie in the iconic lanes of Colaba, Mumbai. Founded by Kainaz Messman Harchandrai with a simple dream: to bring classic, wholesome, honestly-priced baked goods to everyone.
            </p>
            <p className="story-paragraph">
              Named after the Greek botanical name for cacao — <em>Theobroma</em>, meaning "Food of the Gods" — we treat every bake as an offering of delight, staying uncompromising on real butter, pure cocoa, and traditional craftsmanship.
            </p>
            <div className="story-stats-grid">
              <div className="stat-box">
                <strong>150+</strong>
                <span>Neighbourhood Boutiques</span>
              </div>
              <div className="stat-box">
                <strong>25+</strong>
                <span>Cities Served Nationwide</span>
              </div>
              <div className="stat-box">
                <strong>100%</strong>
                <span>Freshly Baked Every Morning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews / Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="sub-heading">Words From Dessert Lovers</span>
            <h2 className="section-title">What Our Guests Say</h2>
          </div>

          <div className="testimonials-grid">
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"The Chocolate Overload Brownie is completely unbeatable. Heated for 10 seconds with vanilla ice cream, it is pure heaven!"</p>
              <div className="reviewer-meta">
                <strong>Pooja Singhania</strong>
                <span>Verified Customer • Mumbai</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"Ordered their New York Cheesecake for my mother's birthday. It arrived in perfect refrigerated packing and tasted divine. Super smooth ordering!"</p>
              <div className="reviewer-meta">
                <strong>Arjun Nair</strong>
                <span>Verified Customer • Bengaluru</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"The eggless chocolate mousse cup and red velvet pastries are consistently rich and moist. Truly the gold standard for Indian patisseries."</p>
              <div className="reviewer-meta">
                <strong>Rhea Mehta</strong>
                <span>Verified Customer • Delhi NCR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / App Download Banner */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-text">
              <h3>Stay in the Sweet Loop</h3>
              <p>Subscribe for seasonal menu launches, exclusive secret sales, and baking stories.</p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Thank you! You are now subscribed to sweet offers.');
                e.target.reset();
              }}
            >
              <input type="email" placeholder="Enter your email address" required className="newsletter-input" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer" id="stores">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: About */}
            <div className="footer-col brand-col">
              <span className="footer-logo">Theobroma</span>
              <p className="footer-tagline">Food of the Gods</p>
              <p className="footer-desc">
                Bringing authentic patisserie, freshly baked artisanal sourdoughs, iconic brownies, and celebratory desserts to your homes.
              </p>
              <div className="social-links">
                <a href="#" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="footer-col">
              <h4 className="footer-title">Our Menu</h4>
              <ul className="footer-links">
                <li><a href="#categories" onClick={() => handleSelectCategory('brownies', true)}>Signature Brownies</a></li>
                <li><a href="#categories" onClick={() => handleSelectCategory('cakes', true)}>Speciality Cakes</a></li>
                <li><a href="#categories" onClick={() => handleSelectCategory('pastries', true)}>Pastries & Slices</a></li>
                <li><a href="#categories" onClick={() => handleSelectCategory('teacakes', true)}>Teacakes & Loaves</a></li>
                <li><a href="#categories" onClick={() => handleSelectCategory('savouries', true)}>Savouries & Puffs</a></li>
                <li><a href="#gifting">Corporate & Festive Gifting</a></li>
              </ul>
            </div>

            {/* Col 3: Customer Care */}
            <div className="footer-col">
              <h4 className="footer-title">Customer Care</h4>
              <ul className="footer-links">
                <li><a href="#track">Track Your Order</a></li>
                <li><a href="#stores">Store Locator (150+ Outlets)</a></li>
                <li><a href="#">Delivery & Shipping Policy</a></li>
                <li><a href="#">Cancellation & Refunds</a></li>
                <li><a href="#">Nutritional & Allergen Info</a></li>
                <li><a href="#">Contact Us & Support</a></li>
              </ul>
            </div>

            {/* Col 4: Top Cities */}
            <div className="footer-col">
              <h4 className="footer-title">Serving Cities</h4>
              <ul className="footer-links cities-list">
                {CITIES.map((c) => (
                  <li key={c.shortName}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentCity(c.name);
                        showToast(`Delivery location set to ${c.name}`);
                      }}
                    >
                      {c.shortName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Theobroma Foods Private Limited. All Rights Reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <span>•</span>
              <a href="#">Terms of Service</a>
              <span>•</span>
              <a href="#">FSSAI License Info</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-Out Shopping Bag Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <h3>Your Sweet Bag</h3>
            <span className="drawer-item-count">{totalItemCount} item{totalItemCount === 1 ? '' : 's'}</span>
          </div>
          <button className="drawer-close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">&times;</button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div className="delivery-progress-bar">
          <div className="progress-info">
            {subtotal >= 500 ? (
              <span>🎉 Yay! You unlocked <strong>FREE Delivery</strong>!</span>
            ) : (
              <span>Add ₹{500 - subtotal} more to unlock <strong>FREE Delivery</strong>!</span>
            )}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Cart Items List Container */}
        <div className="drawer-items">
          {Object.keys(cart).length === 0 ? (
            <div className="empty-cart-state">
              <span>🧁</span>
              <h4>Your bag is feeling light!</h4>
              <p>Explore our fresh brownies, pastries, and treats to fill it up.</p>
              <button className="btn btn-secondary" onClick={() => setIsCartOpen(false)}>Start Browsing</button>
            </div>
          ) : (
            Object.entries(cart).map(([id, qty]) => {
              const item = PRODUCTS.find((p) => p.id === id) || GIFT_ITEMS[id] || { name: 'Patisserie Delicacy', price: 200, image: '' };
              return (
                <div className="cart-item-row" key={id}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <span className="cart-item-price">₹{item.price}</span>
                  </div>
                  <div className="quantity-controller">
                    <button className="qty-btn" onClick={() => updateQty(id, -1)}>-</button>
                    <span className="qty-value">{qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(id, 1)}>+</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer / Checkout */}
        <div className="drawer-footer">
          <div className="bill-row">
            <span>Item Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="bill-row">
            <span>Estimated Taxes (5% GST)</span>
            <span>₹{tax}</span>
          </div>
          <div className="bill-row">
            <span>Delivery Fee</span>
            <span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
          </div>
          <div className="bill-row total-row">
            <strong>Total Amount</strong>
            <strong className="total-price">₹{total}</strong>
          </div>

          <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
            <span>Proceed to Checkout</span>
            <span>₹{total}</span>
          </button>
          <p className="drawer-safe-note">🔒 Safe & contactless delivery at your doorstep</p>
        </div>
      </aside>

      {/* Location Picker Modal */}
      <div className={`modal-backdrop ${isLocationModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsLocationModalOpen(false); }}>
        <div className="modal-card">
          <div className="modal-header">
            <h3>Select Your City</h3>
            <button className="modal-close-btn" onClick={() => setIsLocationModalOpen(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <p className="modal-desc">Please choose your city to view store menus, availability, and delivery timings.</p>
            <div className="city-selector-grid">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  className={`city-tile ${currentCity === c.name ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentCity(c.name);
                    setIsLocationModalOpen(false);
                    showToast(`Delivery location set to ${c.name}`);
                  }}
                >
                  <span className="city-icon">{c.icon}</span>
                  <strong>{c.shortName}</strong>
                  <span>{c.outlets}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <div className={`modal-backdrop ${isSearchModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsSearchModalOpen(false); }}>
        <div className="modal-card search-modal-card">
          <div className="modal-header">
            <h3>Search Delicacies</h3>
            <button className="modal-close-btn" onClick={() => setIsSearchModalOpen(false)}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="search-input-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brownies, truffle cakes, croissants..."
              />
            </div>
            <div className="quick-tags">
              <span>Popular:</span>
              {['Overload', 'Cheesecake', 'Eggless', 'Truffle'].map((tag) => (
                <button
                  key={tag}
                  className="quick-tag"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="search-results-list">
              {searchQuery && searchResults.length === 0 && (
                <p style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No bakery items found for "{searchQuery}".
                </p>
              )}
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: '#FFF9F5',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', display: 'block' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary-accent)', fontWeight: 600 }}>₹{item.price}</span>
                    </div>
                  </div>
                  <button
                    className="btn-sm btn-primary"
                    onClick={() => {
                      addToCart(item.id);
                      setIsSearchModalOpen(false);
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`toast-notification ${isToastVisible ? 'show' : ''}`}>
        <span className="toast-icon">✨</span>
        <span className="toast-message">{toastMessage}</span>
      </div>
    </div>
  );
}

