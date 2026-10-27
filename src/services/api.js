const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || `API request failed (${response.status})`);
  }

  return payload;
}

function extractList(payload, keys) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  for (const key of keys) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  if (payload.data && payload.data !== payload) {
    return extractList(payload.data, keys);
  }

  return [];
}

export async function fetchProducts() {
  const payload = await request('/products');
  return extractList(payload, ['products', 'items', 'data']);
}

export async function fetchGifts() {
  const payload = await request('/gifts');
  return extractList(payload, ['gifts', 'items', 'data']);
}

export async function fetchCities() {
  const payload = await request('/cities');
  return extractList(payload, ['cities', 'items', 'data']);
}

// Backend must validate prices and recalculate totals from MongoDB.
// Never accept a client-calculated total as authoritative.
export async function createOrder(orderPayload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
}
