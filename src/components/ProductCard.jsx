import { useBakery } from '../context/BakeryContext';

export default function ProductCard({ item }) {
  const { addToCart } = useBakery();

  return (
    <article className="product-card" key={item.id}>
      <div className="product-img-wrap">
        <img src={item.image} alt={item.name} className="product-img" loading="lazy" />
        {item.tag && <span className="tag-badge">{item.tag}</span>}
        <div className="diet-indicator" title={item.eggless ? 'Eggless (Vegetarian)' : 'Contains Egg'}>
          <span className={`diet-dot ${item.eggless ? 'veg' : 'non-veg'}`} />
        </div>
      </div>
      <div className="product-info">
        <h4 className="product-title">{item.name}</h4>
        <p className="product-desc">{item.desc}</p>
        <div className="product-meta">
          <div className="price-box">
            <span className="price">₹{item.price.toLocaleString('en-IN')}</span>
            {item.portion && <span className="portion">{item.portion}</span>}
          </div>
          <button className="add-cart-btn" onClick={() => addToCart(item)} type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>ADD</span>
          </button>
        </div>
      </div>
    </article>
  );
}
