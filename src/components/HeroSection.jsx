export default function HeroSection() {
  return (
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a href="#categories" className="btn btn-secondary">Explore Menu</a>
            </div>
            <div className="hero-perks">
              <div className="perk-item"><span className="perk-dot" />60-Min Express Delivery</div>
              <div className="perk-item"><span className="perk-dot" />100% Eggless Options</div>
              <div className="perk-item"><span className="perk-dot" />Authentic Belgian Cocoa</div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"
                alt="Chocolate brownies"
                className="hero-main-img"
              />
              <div className="floating-badge">
                <span className="badge-icon">🍫</span>
                <div className="badge-text"><strong>Iconic Brownie</strong><span>Over 10M+ Slices Sold</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
