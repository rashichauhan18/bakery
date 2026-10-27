import { useBakery } from '../context/BakeryContext';

export default function NewsletterSection() {
  const { showToast } = useBakery();

  const handleSubmit = (event) => {
    event.preventDefault();
    showToast('Newsletter subscription is a demo until its API is connected.');
    event.currentTarget.reset();
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-text">
            <h3>Stay in the Sweet Loop</h3>
            <p>Subscribe for seasonal menu launches, exclusive secret sales, and baking stories.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email address" required className="newsletter-input" aria-label="Email address" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}
