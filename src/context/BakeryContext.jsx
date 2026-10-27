import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createOrder, fetchCities, fetchGifts, fetchProducts } from '../services/api';

const BakeryContext = createContext(null);
const CART_STORAGE_KEY = 'theo_cart';
const CITY_STORAGE_KEY = 'bakery_city';

function getId(item) {
  return String(item?._id ?? item?.id ?? '');
}

function normalizeCatalogItem(item) {
  return {
    ...item,
    id: getId(item),
    desc: item?.desc ?? item?.description ?? '',
    image: item?.image ?? item?.imageUrl ?? '',
    price: Number(item?.price ?? 0),
  };
}

function readSavedCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function BakeryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [currentCategory, setCurrentCategory] = useState('all');
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [currentCity, setCurrentCity] = useState(() => {
    try {
      return localStorage.getItem(CITY_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [cart, setCart] = useState(readSavedCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [cartBadgeScale, setCartBadgeScale] = useState(false);
  const toastTimeoutRef = useRef(null);
  const badgeTimeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    setIsToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => setIsToastVisible(false), 2600);
  }, []);

  const refreshCatalog = useCallback(async () => {
    setLoading(true);
    setLoadError('');

    const [productResult, giftResult, cityResult] = await Promise.allSettled([
      fetchProducts(),
      fetchGifts(),
      fetchCities(),
    ]);

    if (productResult.status === 'fulfilled') {
      setProducts(productResult.value.map(normalizeCatalogItem));
    } else {
      setProducts([]);
      setLoadError(productResult.reason?.message || 'Could not load products.');
    }

    if (giftResult.status === 'fulfilled') {
      setGifts(giftResult.value.map(normalizeCatalogItem));
    } else {
      setGifts([]);
    }

    if (cityResult.status === 'fulfilled') {
      setCities(cityResult.value);
    } else {
      setCities([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Browser storage may be unavailable; the in-memory cart still works.
    }
  }, [cart]);

  useEffect(() => {
    if (!currentCity && cities.length > 0) {
      setCurrentCity(cities[0].name || cities[0].city || '');
    }
  }, [cities, currentCity]);

  useEffect(() => {
    if (!currentCity) return;
    try {
      localStorage.setItem(CITY_STORAGE_KEY, currentCity);
    } catch {
      // Ignore storage errors.
    }
  }, [currentCity]);

  useEffect(() => () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
  }, []);

  const allItems = useMemo(() => [...products, ...gifts], [products, gifts]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (currentCategory !== 'all') {
      list = list.filter((product) => product.category === currentCategory);
    }

    if (egglessOnly) {
      list = list.filter((product) => product.eggless === true);
    }

    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));

    return list;
  }, [products, currentCategory, egglessOnly, sortBy]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    if (query === 'eggless') {
      return allItems.filter((item) => item.eggless === true);
    }

    return allItems.filter((item) =>
      [item.name, item.category, item.desc, item.tag]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [allItems, searchQuery]);

  const cartRows = useMemo(() => Object.entries(cart)
    .map(([itemId, quantity]) => {
      const item = allItems.find((candidate) => candidate.id === String(itemId));
      return item ? { item, itemId: String(itemId), quantity: Number(quantity) } : null;
    })
    .filter(Boolean), [allItems, cart]);

  const totalItemCount = useMemo(
    () => Object.values(cart).reduce((sum, quantity) => sum + Number(quantity || 0), 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cartRows.reduce((sum, row) => sum + row.item.price * row.quantity, 0),
    [cartRows],
  );
  const tax = Math.round(subtotal * 0.05);
  const delivery = subtotal === 0 || subtotal >= 500 ? 0 : 50;
  const total = subtotal === 0 ? 0 : subtotal + tax + delivery;
  const progressPercent = Math.min(100, Math.round((subtotal / 500) * 100));

  const animateCartBadge = useCallback(() => {
    if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
    setCartBadgeScale(true);
    badgeTimeoutRef.current = setTimeout(() => setCartBadgeScale(false), 220);
  }, []);

  const addToCart = useCallback((item) => {
    const itemId = getId(item);
    if (!itemId) {
      showToast('This item is missing an ID from the API.');
      return;
    }

    setCart((previous) => ({ ...previous, [itemId]: (previous[itemId] || 0) + 1 }));
    animateCartBadge();
    showToast(`Added “${item.name || 'Item'}” to your bag!`);
  }, [animateCartBadge, showToast]);

  const directAddToCart = useCallback((item) => {
    addToCart(item);
    setIsCartOpen(true);
  }, [addToCart]);

  const updateQty = useCallback((itemId, delta) => {
    setCart((previous) => {
      const next = { ...previous };
      const newQuantity = Number(next[itemId] || 0) + delta;
      if (newQuantity <= 0) delete next[itemId];
      else next[itemId] = newQuantity;
      return next;
    });
  }, []);

  const selectCategory = useCallback((categoryId, shouldScroll = false) => {
    setCurrentCategory(categoryId);
    if (shouldScroll) {
      window.setTimeout(() => {
        document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setEgglessOnly(false);
    setCurrentCategory('all');
    setSortBy('featured');
  }, []);

  const selectCity = useCallback((cityName) => {
    setCurrentCity(cityName);
    setIsLocationModalOpen(false);
    showToast(`Delivery location set to ${cityName}`);
  }, [showToast]);

  const handleCheckout = useCallback(async () => {
    if (cartRows.length === 0) {
      showToast('Your bag is currently empty!');
      return;
    }
    if (!currentCity) {
      showToast('Select a delivery city before checkout.');
      setIsLocationModalOpen(true);
      return;
    }

    try {
      const result = await createOrder({
        city: currentCity,
        items: cartRows.map(({ item, quantity }) => ({ productId: item.id, quantity })),
      });
      setCart({});
      setIsCartOpen(false);
      showToast(result?.message || 'Order request submitted.');
    } catch (error) {
      showToast(error.message || 'Order API is not available yet. Your cart has been kept.');
    }
  }, [cartRows, currentCity, showToast]);

  const value = {
    products,
    gifts,
    cities,
    loading,
    loadError,
    refreshCatalog,
    currentCategory,
    filteredProducts,
    setCurrentCategory,
    egglessOnly,
    setEgglessOnly,
    sortBy,
    setSortBy,
    currentCity,
    selectCity,
    cart,
    cartRows,
    totalItemCount,
    subtotal,
    tax,
    delivery,
    total,
    progressPercent,
    addToCart,
    directAddToCart,
    updateQty,
    handleCheckout,
    selectCategory,
    resetFilters,
    isCartOpen,
    setIsCartOpen,
    isLocationModalOpen,
    setIsLocationModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    cartBadgeScale,
    toastMessage,
    isToastVisible,
    showToast,
  };

  return <BakeryContext.Provider value={value}>{children}</BakeryContext.Provider>;
}

export function useBakery() {
  const context = useContext(BakeryContext);
  if (!context) throw new Error('useBakery must be used inside BakeryProvider.');
  return context;
}
