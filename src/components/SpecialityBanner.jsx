import { useBakery } from '../context/BakeryContext';

export default function SpecialityBanner() {
  const { selectCategory, showToast } = useBakery();

  return (
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
              <button className="btn btn-primary" onClick={() => selectCategory('cakes', true)} type="button">Order Celebration Cakes</button>
              <button className="btn btn-outline" onClick={() => showToast('Custom cake enquiries need a backend form.')} type="button">Custom Cake Enquiry</button>
            </div>
          </div>
          <div className="banner-image">
            <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80" alt="Chocolate truffle celebration cake" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
