/**
 * Theobroma Patisserie - Frontend Interaction Logic
 * Handles dynamic product rendering, category filtering, eggless toggle,
 * interactive shopping bag, search, city selection, and local persistence.
 */

// Product Catalog Data
const PRODUCTS = [
  {
    id: "p1",
    name: "The Chocolate Overload Brownie",
    category: "brownies",
    tag: "Bestseller",
    price: 130,
    eggless: true,
    rating: 4.9,
    reviews: 1420,
    portion: "1 pc (100g)",
    desc: "Our iconic dense, fudgy chocolate brownie loaded with Belgian dark chocolate chips. Truly legendary.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p2",
    name: "Classic Walnut Brownie",
    category: "brownies",
    tag: "Original Recipe",
    price: 125,
    eggless: false,
    rating: 4.8,
    reviews: 890,
    portion: "1 pc (95g)",
    desc: "Rich dark cocoa base studded generously with toasted Kashmiri walnuts for the perfect crunch.",
    image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p3",
    name: "Dutch Truffle Celebration Cake",
    category: "cakes",
    tag: "Must Try",
    price: 750,
    eggless: true,
    rating: 4.9,
    reviews: 2100,
    portion: "500g (Serves 4-6)",
    desc: "Decadent dark chocolate sponge layered with smooth chocolate ganache made from 54% dark cocoa.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p4",
    name: "New York Style Baked Cheesecake",
    category: "cakes",
    tag: "Chef's Special",
    price: 950,
    eggless: false,
    rating: 4.9,
    reviews: 940,
    portion: "600g (Serves 4-6)",
    desc: "Velvety smooth cream cheese baked over a crisp golden biscuit base. Classic authentic NY recipe.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p5",
    name: "Fresh Strawberry Tart / Pastry",
    category: "pastries",
    tag: "Seasonal",
    price: 165,
    eggless: true,
    rating: 4.7,
    reviews: 430,
    portion: "1 pc (110g)",
    desc: "Crisp butter shortcrust shell filled with vanilla pastry cream and topped with fresh fruit glaze.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p6",
    name: "Red Velvet Pastry Slice",
    category: "pastries",
    tag: "Popular",
    price: 145,
    eggless: true,
    rating: 4.8,
    reviews: 1120,
    portion: "1 pc (120g)",
    desc: "Vibrant crimson cocoa sponge layered with our signature tangy-sweet Philadelphia cream cheese frosting.",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p7",
    name: "Mawa Tea Cake Loaf",
    category: "teacakes",
    tag: "Parsi Classic",
    price: 290,
    eggless: false,
    rating: 4.8,
    reviews: 670,
    portion: "350g Loaf",
    desc: "Our beloved traditional Parsi tea cake enriched with caramelized mawa, cardamom, and almond flakes.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p8",
    name: "Pure Butter Croissant",
    category: "savouries",
    tag: "Artisanal",
    price: 110,
    eggless: false,
    rating: 4.7,
    reviews: 510,
    portion: "1 pc (80g)",
    desc: "Flaky, multi-layered golden French pastry crafted with premium slow-churned butter.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p9",
    name: "Paneer Tikka Roll / Puff",
    category: "savouries",
    tag: "Warm Savoury",
    price: 120,
    eggless: true,
    rating: 4.6,
    reviews: 380,
    portion: "1 pc (130g)",
    desc: "Spiced chargrilled cottage cheese wrapped in delicate, crisp puff pastry. Served warm.",
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "p10",
    name: "Assorted Brownie Celebration Box (Pack of 6)",
    category: "gifting",
    tag: "Gift Ready",
    price: 650,
    eggless: true,
    rating: 5.0,
    reviews: 1820,
    portion: "6 Assorted Brownies",
    desc: "A curated gift box containing Walnut, Overload, Cookie-Dough, and Nutella brownies in elegant packaging.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80"
  }
];

// Application State
const state = {
  currentCategory: 'all',
  egglessOnly: false,
  sortBy: 'featured',
  cart: {}, // { productId: quantity }
  currentCity: 'Mumbai, Bandra West',
  searchQuery: ''
};

// DOM Selectors
const productsGrid = document.getElementById('productsGrid');
const displayedCategoryTitle = document.getElementById('displayedCategoryTitle');
const itemsCount = document.getElementById('itemsCount');
const egglessFilter = document.getElementById('egglessFilter');
const sortSelect = document.getElementById('sortSelect');
const categoryPills = document.querySelectorAll('.category-pill');

// Cart Drawer Selectors
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartItemsList = document.getElementById('cartItemsList');
const cartCount = document.getElementById('cartCount');
const drawerItemCount = document.getElementById('drawerItemCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTax = document.getElementById('cartTax');
const cartDelivery = document.getElementById('cartDelivery');
const cartTotal = document.getElementById('cartTotal');
const checkoutTotalText = document.getElementById('checkoutTotalText');
const progressFill = document.getElementById('progressFill');
const freeDeliveryText = document.getElementById('freeDeliveryText');
const checkoutBtn = document.getElementById('checkoutBtn');

// Location Selectors
const locationPickerBtn = document.getElementById('locationPickerBtn');
const locationModal = document.getElementById('locationModal');
const closeLocationModal = document.getElementById('closeLocationModal');
const currentCityText = document.getElementById('currentCityText');

// Search Selectors
const searchTriggerBtn = document.getElementById('searchTriggerBtn');
const searchModal = document.getElementById('searchModal');
const closeSearchModal = document.getElementById('closeSearchModal');
const liveSearchInput = document.getElementById('liveSearchInput');
const searchResultsContainer = document.getElementById('searchResultsContainer');

// Toast
const toastNotice = document.getElementById('toastNotice');
const toastMessage = document.getElementById('toastMessage');

// Header
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  renderProducts();
  setupEventListeners();
  updateCartUI();
});

// Setup Listeners
function setupEventListeners() {
  // Category Pill Filter
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.currentCategory = pill.dataset.category;
      renderProducts();
    });
  });

  // Eggless filter toggle
  egglessFilter.addEventListener('change', (e) => {
    state.egglessOnly = e.target.checked;
    renderProducts();
  });

  // Sort selector
  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // Cart Drawer open/close
  cartBtn.addEventListener('click', openCart);
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Location Modal
  locationPickerBtn.addEventListener('click', () => locationModal.classList.add('open'));
  closeLocationModal.addEventListener('click', () => locationModal.classList.remove('open'));
  locationModal.addEventListener('click', (e) => {
    if (e.target === locationModal) locationModal.classList.remove('open');
  });

  // Search Modal
  searchTriggerBtn.addEventListener('click', () => {
    searchModal.classList.add('open');
    setTimeout(() => liveSearchInput.focus(), 150);
  });
  closeSearchModal.addEventListener('click', () => searchModal.classList.remove('open'));
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) searchModal.classList.remove('open');
  });
  liveSearchInput.addEventListener('input', handleSearchInput);

  // Mobile Menu Toggle
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Checkout simulation
  checkoutBtn.addEventListener('click', () => {
    const totalItems = Object.values(state.cart).reduce((a, b) => a + b, 0);
    if (totalItems === 0) {
      showToast('Your bag is currently empty!');
      return;
    }
    showToast('Redirecting to secure payment gateway...');
    setTimeout(() => {
      alert(`Thank you for ordering with Theobroma!\nOrder placed for ${state.currentCity}.\nDelivery dispatched.`);
      state.cart = {};
      saveCartToStorage();
      updateCartUI();
      closeCart();
    }, 600);
  });

  // Newsletter Submit
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you! You are now subscribed to sweet offers.');
      newsletterForm.reset();
    });
  }

  // Scroll Header Shadow
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Render Products with Filters & Sorting
function renderProducts() {
  let list = [...PRODUCTS];

  // Category filter
  if (state.currentCategory !== 'all') {
    list = list.filter(item => item.category === state.currentCategory);
  }

  // Eggless filter
  if (state.egglessOnly) {
    list = list.filter(item => item.eggless === true);
  }

  // Sorting
  if (state.sortBy === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  // Update Toolbar texts
  const titles = {
    all: 'All Delicacies & Daily Bakes',
    brownies: 'Signature Handcrafted Brownies',
    cakes: 'Speciality Celebration Cakes & Cheesecakes',
    pastries: 'Delicate Pastries & Fruit Tarts',
    teacakes: 'Artisanal Teacakes & Daily Loaves',
    savouries: 'Oven-Warm Savouries & Puffs',
    gifting: 'Luxury Hampers & Gift Boxes'
  };
  displayedCategoryTitle.textContent = titles[state.currentCategory] || 'Our Menu';
  itemsCount.textContent = `Showing ${list.length} item${list.length === 1 ? '' : 's'}`;

  // Build HTML
  if (list.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #FFF; border-radius: 14px;">
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 12px;">No baked items found matching your current filter.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = list.map(item => `
    <article class="product-card" data-id="${item.id}">
      <div class="product-img-wrap">
        <img src="${item.image}" alt="${item.name}" class="product-img" loading="lazy">
        <span class="tag-badge">${item.tag}</span>
        <div class="diet-indicator" title="${item.eggless ? 'Eggless (Vegetarian)' : 'Contains Egg'}">
          <span class="diet-dot ${item.eggless ? 'veg' : 'non-veg'}"></span>
        </div>
      </div>
      <div class="product-info">
        <h4 class="product-title">${item.name}</h4>
        <p class="product-desc">${item.desc}</p>
        <div class="product-meta">
          <div class="price-box">
            <span class="price">₹${item.price}</span>
            <span class="portion">${item.portion}</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart('${item.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>ADD</span>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// Reset filters
window.resetFilters = function() {
  state.egglessOnly = false;
  egglessFilter.checked = false;
  state.currentCategory = 'all';
  categoryPills.forEach(p => p.classList.remove('active'));
  categoryPills[0].classList.add('active');
  renderProducts();
};

// Filter by category helper (e.g. from banner or footer links)
window.filterByCat = function(categoryName) {
  state.currentCategory = categoryName;
  categoryPills.forEach(p => {
    if (p.dataset.category === categoryName) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
  renderProducts();
  const menuSection = document.getElementById('bestsellers');
  if (menuSection) {
    menuSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Cart Management
window.addToCart = function(productId) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  saveCartToStorage();
  updateCartUI();
  
  const product = PRODUCTS.find(p => p.id === productId);
  showToast(`Added "${product ? product.name : 'Item'}" to bag!`);
};

window.directAddToCart = function(giftId) {
  // Fallback map for custom gift cards
  const giftMap = {
    g1: { id: "g1", name: "Assorted Brownie Celebration Box", price: 650, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80" },
    g2: { id: "g2", name: "Artisanal Tea-Time Hamper", price: 1250, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" },
    g3: { id: "g3", name: "The Royal Grand Patisserie Box", price: 2100, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80" }
  };
  state.cart[giftId] = (state.cart[giftId] || 0) + 1;
  saveCartToStorage();
  updateCartUI();
  showToast(`Gift hamper added to your bag!`);
  openCart();
};

window.updateQty = function(productId, delta) {
  if (!state.cart[productId]) return;
  state.cart[productId] += delta;
  if (state.cart[productId] <= 0) {
    delete state.cart[productId];
  }
  saveCartToStorage();
  updateCartUI();
};

function updateCartUI() {
  const itemKeys = Object.keys(state.cart);
  const totalCount = Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);

  cartCount.textContent = totalCount;
  drawerItemCount.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

  // Scale badge animation
  cartCount.style.transform = 'scale(1.25)';
  setTimeout(() => cartCount.style.transform = 'scale(1)', 200);

  if (itemKeys.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart-state">
        <span>🧁</span>
        <h4>Your bag is feeling light!</h4>
        <p>Explore our fresh brownies, pastries, and treats to fill it up.</p>
        <button class="btn btn-secondary" onclick="closeCart()">Start Browsing</button>
      </div>
    `;
    cartSubtotal.textContent = '₹0';
    cartTax.textContent = '₹0';
    cartDelivery.textContent = '₹0';
    cartTotal.textContent = '₹0';
    checkoutTotalText.textContent = '₹0';
    progressFill.style.width = '0%';
    freeDeliveryText.innerHTML = `Add ₹500 more to unlock <strong>FREE Delivery</strong>!`;
    return;
  }

  let subtotal = 0;
  cartItemsList.innerHTML = itemKeys.map(id => {
    let item = PRODUCTS.find(p => p.id === id);
    if (!item) {
      // Check gifting mock map
      const giftMap = {
        g1: { name: "Assorted Brownie Celebration Box", price: 650, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80" },
        g2: { name: "Artisanal Tea-Time Hamper", price: 1250, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80" },
        g3: { name: "The Royal Grand Patisserie Box", price: 2100, image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=200&q=80" }
      };
      item = giftMap[id] || { name: "Patisserie Delicacy", price: 200, image: "" };
    }
    const qty = state.cart[id];
    const itemTotal = item.price * qty;
    subtotal += itemTotal;

    return `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <span class="cart-item-price">₹${item.price}</span>
        </div>
        <div class="quantity-controller">
          <button class="qty-btn" onclick="updateQty('${id}', -1)">-</button>
          <span class="qty-value">${qty}</span>
          <button class="qty-btn" onclick="updateQty('${id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  // Calculations
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const freeThreshold = 500;
  const delivery = subtotal >= freeThreshold ? 0 : 50;
  const total = subtotal + tax + delivery;

  cartSubtotal.textContent = `₹${subtotal}`;
  cartTax.textContent = `₹${tax}`;
  cartDelivery.textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
  cartTotal.textContent = `₹${total}`;
  checkoutTotalText.textContent = `₹${total}`;

  // Free delivery progress
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  progressFill.style.width = `${progressPercent}%`;

  if (subtotal >= freeThreshold) {
    freeDeliveryText.innerHTML = `🎉 Yay! You unlocked <strong>FREE Delivery</strong>!`;
  } else {
    freeDeliveryText.innerHTML = `Add ₹${freeThreshold - subtotal} more to unlock <strong>FREE Delivery</strong>!`;
  }
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Location City Selection
window.selectCity = function(cityName) {
  state.currentCity = cityName;
  currentCityText.textContent = cityName;
  locationModal.classList.remove('open');
  showToast(`Delivery location set to ${cityName}`);
};

// Search System
function handleSearchInput(e) {
  const query = e.target.value.toLowerCase().trim();
  renderSearchResults(query);
}

window.searchFor = function(keyword) {
  liveSearchInput.value = keyword;
  renderSearchResults(keyword.toLowerCase().trim());
};

function renderSearchResults(query) {
  if (!query) {
    searchResultsContainer.innerHTML = '';
    return;
  }

  const results = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.desc.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    searchResultsContainer.innerHTML = `<p style="padding: 12px; font-size: 0.85rem; color: var(--text-muted);">No bakery items found for "${query}".</p>`;
    return;
  }

  searchResultsContainer.innerHTML = results.map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #FFF9F5; border-radius: 8px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${item.image}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;">
        <div>
          <strong style="font-size: 0.88rem; display: block;">${item.name}</strong>
          <span style="font-size: 0.78rem; color: var(--primary-accent); font-weight: 600;">₹${item.price}</span>
        </div>
      </div>
      <button class="btn-sm btn-primary" onclick="addToCart('${item.id}'); searchModal.classList.remove('open');">Add</button>
    </div>
  `).join('');
}

// Toast System
function showToast(msg) {
  toastMessage.textContent = msg;
  toastNotice.classList.add('show');
  setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 2600);
}

// Local Storage Persistence
function saveCartToStorage() {
  try {
    localStorage.setItem('theo_cart', JSON.stringify(state.cart));
  } catch (e) {
    // Local storage not available or quota exceeded
  }
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('theo_cart');
    if (saved) {
      state.cart = JSON.parse(saved);
    }
  } catch (e) {
    state.cart = {};
  }
}
