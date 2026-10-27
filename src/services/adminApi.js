const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

const TOKEN_KEY = 'bakery_admin_token';

export function getAdminToken() {
  try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}

function setAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    throw new Error('Browser session storage is unavailable.');
  }
}

async function request(path, options = {}, authenticated = false) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getAdminToken();
  if (authenticated && token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    if (authenticated && response.status === 401) setAdminToken('');
    throw new Error(payload?.message || `Request failed (${response.status}).`);
  }
  return payload;
}

export async function adminLogin(email, password) {
  const result = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (!result?.token || result?.user?.role !== 'admin') throw new Error('The server did not return an admin session.');
  setAdminToken(result.token);
  return result.user;
}

export async function getAdminSession() {
  if (!getAdminToken()) throw new Error('No admin session.');
  const result = await request('/auth/me', {}, true);
  if (result?.user?.role !== 'admin') throw new Error('Administrator access required.');
  return result.user;
}

export function adminLogout() { setAdminToken(''); }

export async function listAdminProducts() {
  const result = await request('/products/admin/all', {}, true);
  return result.products || [];
}

export async function createAdminProduct(product) {
  return request('/products', { method: 'POST', body: JSON.stringify(product) }, true);
}

export async function updateAdminProduct(id, product) {
  return request(`/products/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(product) }, true);
}

export async function deleteAdminProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
}
