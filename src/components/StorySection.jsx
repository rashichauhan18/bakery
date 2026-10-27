export default function StorySection() {
  return (
    <section className="section story-section" id="story">
      <div className="container story-inner">
        <div className="story-image-column">
          <div className="story-image-stack">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80"
              alt="Bakery kitchen and artisans"
              className="stack-img-1"
              loading="lazy"
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
            Named after the Greek botanical name for cacao — <em>Theobroma</em>, meaning “Food of the Gods” — we treat every bake as an offering of delight, staying uncompromising on real butter, pure cocoa, and traditional craftsmanship.
          </p>
          <div className="story-stats-grid">
            <div className="stat-box"><strong>150+</strong><span>Neighbourhood Boutiques</span></div>
            <div className="stat-box"><strong>25+</strong><span>Cities Served Nationwide</span></div>
            <div className="stat-box"><strong>100%</strong><span>Freshly Baked Every Morning</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
