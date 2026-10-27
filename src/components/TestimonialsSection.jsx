const reviews = [
  {
    quote: '“The Chocolate Overload Brownie is completely unbeatable. Heated for 10 seconds with vanilla ice cream, it is pure heaven!”',
    name: 'Pooja Singhania',
    location: 'Verified Customer • Mumbai',
  },
  {
    quote: '“Ordered their New York Cheesecake for my mother’s birthday. It arrived in perfect refrigerated packing and tasted divine. Super smooth ordering!”',
    name: 'Arjun Nair',
    location: 'Verified Customer • Bengaluru',
  },
  {
    quote: '“The eggless chocolate mousse cup and red velvet pastries are consistently rich and moist. Truly the gold standard for Indian patisseries.”',
    name: 'Rhea Mehta',
    location: 'Verified Customer • Delhi NCR',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <span className="sub-heading">Words From Dessert Lovers</span>
          <h2 className="section-title">What Our Guests Say</h2>
        </div>
        <div className="testimonials-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="review-stars" aria-label="5 out of 5 stars">★★★★★</div>
              <p className="review-text">{review.quote}</p>
              <div className="reviewer-meta"><strong>{review.name}</strong><span>{review.location}</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
