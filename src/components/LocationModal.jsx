import { useBakery } from '../context/BakeryContext';

export default function LocationModal() {
  const { cities, currentCity, isLocationModalOpen, setIsLocationModalOpen, selectCity } = useBakery();

  return (
    <div
      className={`modal-backdrop ${isLocationModalOpen ? 'open' : ''}`}
      onClick={(event) => { if (event.target === event.currentTarget) setIsLocationModalOpen(false); }}
      aria-hidden={!isLocationModalOpen}
    >
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="location-modal-title">
        <div className="modal-header">
          <h3 id="location-modal-title">Select Your City</h3>
          <button className="modal-close-btn" onClick={() => setIsLocationModalOpen(false)} type="button" aria-label="Close location picker">&times;</button>
        </div>
        <div className="modal-body">
          <p className="modal-desc">Please choose your city to view store menus, availability, and delivery timings.</p>
          {cities.length === 0 ? (
            <p>No cities were returned by GET /api/cities.</p>
          ) : (
            <div className="city-selector-grid">
              {cities.map((city) => {
                const name = city.name || city.city || city.shortName;
                const shortName = city.shortName || name;
                return (
                  <button
                    key={String(city._id ?? name)}
                    className={`city-tile ${currentCity === name ? 'active' : ''}`}
                    onClick={() => selectCity(name)}
                    type="button"
                  >
                    <span className="city-icon">{city.icon || '📍'}</span>
                    <strong>{shortName}</strong>
                    {city.outlets && <span>{city.outlets}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
