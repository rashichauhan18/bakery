const benefits = [
  { icon: '★', title: 'Pure Ingredients', text: 'Real cocoa, creamery butter, and genuine ingredients with zero shortcuts.' },
  { icon: '◷', title: 'Baked Fresh Daily', text: 'Prepared in small artisanal batches early morning to preserve authentic warmth.' },
  { icon: '➜', title: 'Same-Day Doorstep Delivery', text: 'Delivered safely in temperature-insulated sustainable boxes.' },
  { icon: '♡', title: 'Honestly Priced', text: 'Luxury desserts made accessible for everyday celebrations and tea times.' },
];

export default function BenefitsSection() {
  return (
    <section className="usp-section">
      <div className="container">
        <div className="usp-grid">
          {benefits.map((benefit) => (
            <article className="usp-card" key={benefit.title}>
              <div className="usp-icon-wrap" aria-hidden="true">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
