import { useBakery } from '../context/BakeryContext';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartRows,
    totalItemCount,
    subtotal,
    tax,
    delivery,
    total,
    progressPercent,
    updateQty,
    handleCheckout,
  } = useBakery();

  return (
    <>
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} aria-hidden="true" />
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`} aria-label="Shopping cart" aria-hidden={!isCartOpen}>
        <div className="drawer-header">
          <div className="drawer-title">
            <h3>Your Sweet Bag</h3>
            <span className="drawer-item-count">{totalItemCount} item{totalItemCount === 1 ? '' : 's'}</span>
          </div>
          <button className="drawer-close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart" type="button">&times;</button>
        </div>

        <div className="delivery-progress-bar">
          <div className="progress-info">
            {subtotal >= 500 ? (
              <span>🎉 Yay! You unlocked <strong>FREE Delivery</strong>!</span>
            ) : (
              <span>Add ₹{500 - subtotal} more to unlock <strong>FREE Delivery</strong>!</span>
            )}
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPercent}%` }} /></div>
        </div>

        <div className="drawer-items">
          {cartRows.length === 0 ? (
            <div className="empty-cart-state">
              <span>🧁</span>
              <h4>Your bag is feeling light!</h4>
              <p>Explore our fresh brownies, pastries, and treats to fill it up.</p>
              <button className="btn btn-secondary" onClick={() => setIsCartOpen(false)} type="button">Start Browsing</button>
            </div>
          ) : cartRows.map(({ item, itemId, quantity }) => (
            <div className="cart-item-row" key={itemId}>
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-details">
                <h4 className="cart-item-name">{item.name}</h4>
                <span className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="quantity-controller">
                <button className="qty-btn" onClick={() => updateQty(itemId, -1)} type="button" aria-label={`Remove one ${item.name}`}>-</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => updateQty(itemId, 1)} type="button" aria-label={`Add one ${item.name}`}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="drawer-footer">
          <div className="bill-row"><span>Item Subtotal</span><span>₹{subtotal}</span></div>
          <div className="bill-row"><span>Estimated Taxes (5% GST)</span><span>₹{tax}</span></div>
          <div className="bill-row"><span>Delivery Fee</span><span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
          <div className="bill-row total-row"><strong>Total Amount</strong><strong className="total-price">₹{total}</strong></div>
          <button className="btn btn-primary checkout-btn" onClick={handleCheckout} type="button" disabled={cartRows.length === 0}>
            <span>Proceed to Checkout</span><span>₹{total}</span>
          </button>
          <p className="drawer-safe-note">🔒 Safe and contactless delivery at your doorstep</p>
        </div>
      </aside>
    </>
  );
}
