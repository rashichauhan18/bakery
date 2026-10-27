import { useBakery } from '../context/BakeryContext';

export default function GiftingSection() {
  const { gifts, loading, directAddToCart } = useBakery();

  return (
    <section className="section gifting-section" id="gifting">
      <div className="container">
        <div className="section-header">
          <span className="sub-heading">Thoughtfully Curated</span>
          <h2 className="section-title">Festive & Corporate Gifting</h2>
          <p className="section-desc">Share sweetness with your loved ones and colleagues. Elegant gift tins and custom hampers.</p>
        </div>
        <div className="gifting-grid">
          {loading ? <p>Loading gift hampers…</p> : gifts.length === 0 ? (
            <p>No gift hampers are available from the API yet.</p>
          ) : gifts.map((gift) => (
            <article className="gifting-card" key={gift.id}>
              <div className="gifting-img-wrap"><img src={gift.image} alt={gift.name} loading="lazy" /></div>
              <div className="gifting-info">
                <span className="gift-tag">{gift.tag || 'Gift Hamper'}</span>
                <h4>{gift.name}</h4>
                <p>{gift.desc}</p>
                <div className="gift-footer">
                  <span className="gift-price">₹{gift.price.toLocaleString('en-IN')}</span>
                  <button className="btn-sm btn-primary" onClick={() => directAddToCart(gift)} type="button">Add to Bag</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
