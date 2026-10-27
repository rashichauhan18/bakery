import { useEffect, useState } from 'react';
import { useBakery } from '../context/BakeryContext';

export default function Header() {
  const {
    currentCity,
    totalItemCount,
    cartBadgeScale,
    setIsCartOpen,
    setIsLocationModalOpen,
    setIsSearchModalOpen,
    showToast,
  } = useBakery();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsHeaderScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`main-header ${isHeaderScrolled ? 'scrolled' : ''}`} id="header">
      <div className="container header-inner">
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="brand-identity">
          <a href="#header" className="brand-logo">
            <span className="logo-script">Theobroma</span>
            <span className="logo-tagline">FOOD OF THE GODS • PATISSERIE</span>
          </a>
        </div>

        <button className="location-picker" onClick={() => setIsLocationModalOpen(true)} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="location-details">
            <span className="location-label">Delivering to</span>
            <span className="current-city">{currentCity || 'Select location'}</span>
          </span>
          <svg className="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#categories" className="nav-link active" onClick={closeMobileMenu}>Menu</a>
          <a href="#bestsellers" className="nav-link" onClick={closeMobileMenu}>Best Sellers</a>
          <a href="#speciality-cakes" className="nav-link" onClick={closeMobileMenu}>Speciality Cakes</a>
          <a href="#gifting" className="nav-link" onClick={closeMobileMenu}>Gifting & Hampers</a>
          <a href="#story" className="nav-link" onClick={closeMobileMenu}>Our Story</a>
        </nav>

        <div className="header-actions">
          <button className="action-btn search-trigger" onClick={() => setIsSearchModalOpen(true)} title="Search delicacies" aria-label="Search delicacies">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className="action-btn" title="My Account" onClick={() => showToast('Sign in is not connected yet.')} aria-label="My account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="action-btn cart-btn" onClick={() => setIsCartOpen(true)} title="Shopping Bag" aria-label="Open shopping bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="cart-badge" style={{ transform: cartBadgeScale ? 'scale(1.25)' : 'scale(1)' }}>{totalItemCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
