import { useBakery } from '../context/BakeryContext';

const CATEGORIES = [
  { id: 'all', label: 'All Items', emoji: '🍰' },
  { id: 'brownies', label: 'Brownies', emoji: '🍫' },
  { id: 'cakes', label: 'Cakes & Cheesecakes', emoji: '🎂' },
  { id: 'pastries', label: 'Pastries & Tarts', emoji: '🧁' },
  { id: 'teacakes', label: 'Tea Cakes & Breads', emoji: '🍞' },
  { id: 'savouries', label: 'Savouries & Puffs', emoji: '🥐' },
  { id: 'gifting', label: 'Hampers & Gifting', emoji: '🎁' },
];

export default function CategorySection() {
  const { currentCategory, selectCategory } = useBakery();

  return (
    <section className="section categories-section" id="categories">
      <div className="container">
        <div className="section-header">
          <span className="sub-heading">Browse By Delicacy</span>
          <h2 className="section-title">Explore Our Menu</h2>
          <p className="section-desc">From our iconic brownies to artisan sourdough and delicate tea-cakes.</p>
        </div>
        <div className="category-slider">
          {CATEGORIES.map((category) => (
            <button
              type="button"
              key={category.id}
              className={`category-pill ${currentCategory === category.id ? 'active' : ''}`}
              onClick={() => selectCategory(category.id)}
            >
              <span className="cat-emoji">{category.emoji}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
