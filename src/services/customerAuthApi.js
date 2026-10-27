const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

const TOKEN_KEY = 'bakery_customer_token';

export function getCustomerToken() {
  try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}

function saveCustomerToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    throw new Error('Browser session storage is unavailable.');
  }
}

async function request(path, options = {}, authenticated = false) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (authenticated) {
    const token = getCustomerToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || `Request failed (${response.status}).`);
  return payload;
}

function storeAuth(payload) {
  if (!payload?.token || !payload?.user) throw new Error('The server did not return an authentication session.');
  if (payload.user.role === 'admin') {
    // Allow an admin who uses the shared login endpoint to reach the separate admin UI.
    try { sessionStorage.setItem('bakery_admin_token', payload.token); } catch {}
    saveCustomerToken('');
  } else {
    saveCustomerToken(payload.token);
  }
  return payload.user;
}

export async function customerRegister({ name, email, password }) {
  const payload = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return storeAuth(payload);
}

export async function customerLogin(email, password) {
  const payload = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return storeAuth(payload);
}

export async function getCustomerSession() {
  if (!getCustomerToken()) return null;
  try {
    const payload = await request('/auth/me', {}, true);
    if (payload?.user?.role !== 'customer') throw new Error('This is not a customer account.');
    return payload.user;
  } catch (error) {
    saveCustomerToken('');
    throw error;
  }
}

export function customerLogout() { saveCustomerToken(''); }
