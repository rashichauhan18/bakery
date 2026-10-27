import { useBakery } from '../context/BakeryContext';

export default function Footer() {
  const { cities, selectCity, selectCategory, showToast } = useBakery();

  const chooseCategory = (event, category) => {
    event.preventDefault();
    selectCategory(category, true);
  };

  return (
    <footer className="main-footer" id="stores">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <span className="footer-logo">Theobroma</span>
            <p className="footer-tagline">Food of the Gods</p>
            <p className="footer-desc">Bringing authentic patisserie, freshly baked artisanal sourdoughs, iconic brownies, and celebratory desserts to your homes.</p>
            <div className="social-links">
              <a href="#stores" aria-label="Instagram" onClick={(event) => { event.preventDefault(); showToast('Social link not configured yet.'); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#stores" aria-label="Facebook" onClick={(event) => { event.preventDefault(); showToast('Social link not configured yet.'); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#stores" aria-label="Twitter" onClick={(event) => { event.preventDefault(); showToast('Social link not configured yet.'); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Our Menu</h4>
            <ul className="footer-links">
              <li><a href="#categories" onClick={(event) => chooseCategory(event, 'brownies')}>Signature Brownies</a></li>
              <li><a href="#categories" onClick={(event) => chooseCategory(event, 'cakes')}>Speciality Cakes</a></li>
              <li><a href="#categories" onClick={(event) => chooseCategory(event, 'pastries')}>Pastries & Slices</a></li>
              <li><a href="#categories" onClick={(event) => chooseCategory(event, 'teacakes')}>Teacakes & Loaves</a></li>
              <li><a href="#categories" onClick={(event) => chooseCategory(event, 'savouries')}>Savouries & Puffs</a></li>
              <li><a href="#gifting">Corporate & Festive Gifting</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Customer Care</h4>
            <ul className="footer-links">
              <li><a href="#track" onClick={(event) => { event.preventDefault(); showToast('Order tracking is not connected yet.'); }}>Track Your Order</a></li>
              <li><a href="#stores">Store Locator</a></li>
              <li><a href="#stores" onClick={(event) => { event.preventDefault(); showToast('Shipping policy page is not created yet.'); }}>Delivery & Shipping Policy</a></li>
              <li><a href="#stores" onClick={(event) => { event.preventDefault(); showToast('Refund policy page is not created yet.'); }}>Cancellation & Refunds</a></li>
              <li><a href="#stores" onClick={(event) => { event.preventDefault(); showToast('Allergen information page is not created yet.'); }}>Nutritional & Allergen Info</a></li>
              <li><a href="#stores" onClick={(event) => { event.preventDefault(); showToast('Contact form is not connected yet.'); }}>Contact Us & Support</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Serving Cities</h4>
            <ul className="footer-links cities-list">
              {cities.map((city) => {
                const name = city.name || city.city || city.shortName;
                const shortName = city.shortName || name;
                return (
                  <li key={String(city._id ?? name)}>
                    <a href="#stores" onClick={(event) => { event.preventDefault(); selectCity(name); }}>{shortName}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Theobroma Foods Private Limited. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#stores" onClick={(event) => { event.preventDefault(); showToast('Privacy policy page is not created yet.'); }}>Privacy Policy</a>
            <span>•</span>
            <a href="#stores" onClick={(event) => { event.preventDefault(); showToast('Terms page is not created yet.'); }}>Terms of Service</a>
            <span>•</span>
            <a href="#stores" onClick={(event) => { event.preventDefault(); showToast('License information page is not created yet.'); }}>FSSAI License Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
