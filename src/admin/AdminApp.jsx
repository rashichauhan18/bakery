import { useCallback, useEffect, useState } from 'react';
import {
  adminLogin,
  adminLogout,
  createAdminProduct,
  deleteAdminProduct,
  getAdminSession,
  listAdminProducts,
  updateAdminProduct,
} from '../services/adminApi';

const EMPTY_FORM = {
  id: '', name: '', category: 'cakes', tag: '', price: '', eggless: false,
  rating: '0', reviews: '0', portion: '', desc: '', image: '',
};
const CATEGORIES = ['brownies', 'cakes', 'pastries', 'teacakes', 'savouries', 'gifting'];

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try { onLogin(await adminLogin(email, password)); }
    catch (err) { setError(err.message || 'Login failed.'); }
    finally { setBusy(false); }
  }

  return (
    <main className="admin-shell">
      <section className="admin-login-card">
        <a className="admin-back-link" href="/">← Back to bakery</a>
        <p className="admin-eyebrow">THEOBROMA PATISSERIE</p>
        <h1>Admin sign in</h1>
        <p className="admin-muted">Sign in using the administrator account configured for this project.</p>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>Email<input type="email" autoComplete="username" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {error && <p className="admin-error" role="alert">{error}</p>}
          <button className="admin-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="admin-hint">Admin accounts are created privately by the backend. Public admin registration is disabled.</p>
      </section>
    </main>
  );
}

function ProductForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const editing = Boolean(initial?._id);
  function change(name, value) { setForm((prev) => ({ ...prev, [name]: value })); }

  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    const payload = {
      name: form.name.trim(), category: form.category, tag: form.tag.trim(),
      price: Number(form.price), eggless: Boolean(form.eggless),
      rating: Number(form.rating || 0), reviews: Number(form.reviews || 0),
      portion: form.portion.trim(), desc: form.desc.trim(), image: form.image.trim(), isActive: true,
    };
    if (!editing && form.id.trim()) payload.id = form.id.trim();
    try { await onSaved(payload); }
    catch (err) { setError(err.message || 'Could not save the product.'); }
    finally { setBusy(false); }
  }

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit product' : 'Add a product'}</h2>
      {!editing && <label>Product ID (optional)<input value={form.id} maxLength={80} placeholder="Auto-generated if blank" onChange={(e) => change('id', e.target.value)} /></label>}
      <label>Product name<input required maxLength={120} value={form.name} onChange={(e) => change('name', e.target.value)} /></label>
      <div className="admin-form-grid">
        <label>Category<select value={form.category} onChange={(e) => change('category', e.target.value)}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
        <label>Price (₹)<input type="number" min="0" step="0.01" required value={form.price} onChange={(e) => change('price', e.target.value)} /></label>
      </div>
      <div className="admin-form-grid">
        <label>Tag<input maxLength={80} value={form.tag} onChange={(e) => change('tag', e.target.value)} placeholder="Bestseller" /></label>
        <label>Portion<input maxLength={80} value={form.portion} onChange={(e) => change('portion', e.target.value)} placeholder="500g" /></label>
      </div>
      <label>Image URL<input type="url" value={form.image} onChange={(e) => change('image', e.target.value)} placeholder="https://…" /></label>
      <label>Description<textarea rows="3" maxLength={2000} value={form.desc} onChange={(e) => change('desc', e.target.value)} /></label>
      <div className="admin-form-grid">
        <label>Rating (0–5)<input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => change('rating', e.target.value)} /></label>
        <label>Review count<input type="number" min="0" step="1" value={form.reviews} onChange={(e) => change('reviews', e.target.value)} /></label>
      </div>
      <label className="admin-checkbox"><input type="checkbox" checked={form.eggless} onChange={(e) => change('eggless', e.target.checked)} /> Eggless</label>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-actions"><button className="admin-primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create product'}</button><button type="button" className="admin-secondary" onClick={onCancel}>Cancel</button></div>
    </form>
  );
}

function ProductDashboard({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [formProduct, setFormProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setProducts(await listAdminProducts()); }
    catch (err) { setError(err.message || 'Could not load products.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function saveProduct(payload) {
    const editing = Boolean(formProduct?._id);
    if (editing) await updateAdminProduct(formProduct._id, payload);
    else await createAdminProduct(payload);
    setShowForm(false); setFormProduct(null); setNotice(editing ? 'Product updated.' : 'Product created.');
    await refresh();
  }

  async function removeProduct(product) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    setError(''); setNotice('');
    try { await deleteAdminProduct(product._id || product.id); setNotice('Product deleted.'); await refresh(); }
    catch (err) { setError(err.message || 'Could not delete the product.'); }
  }

  function beginEdit(product) {
    setFormProduct({ ...EMPTY_FORM, ...product, price: String(product.price), rating: String(product.rating ?? 0), reviews: String(product.reviews ?? 0) });
    setShowForm(true); setNotice(''); setError('');
  }
  function beginCreate() { setFormProduct(null); setShowForm(true); setNotice(''); setError(''); }

  return (
    <main className="admin-dashboard">
      <header className="admin-topbar"><a className="admin-brand" href="/">Theobroma <span>ADMIN</span></a><div className="admin-user"><span>{user.name || user.email}</span><button className="admin-secondary" onClick={onLogout}>Sign out</button></div></header>
      <section className="admin-content">
        <div className="admin-heading-row"><div><p className="admin-eyebrow">CATALOGUE MANAGEMENT</p><h1>Products</h1><p className="admin-muted">Create, update, and delete products displayed in the storefront.</p></div><button className="admin-primary" onClick={beginCreate}>+ Add product</button></div>
        {notice && <p className="admin-notice" role="status">{notice}</p>}
        {error && <p className="admin-error" role="alert">{error}</p>}
        {showForm && <ProductForm key={formProduct?._id || 'new'} initial={formProduct} onCancel={() => { setShowForm(false); setFormProduct(null); }} onSaved={saveProduct} />}
        <section className="admin-table-wrap"><div className="admin-table-title"><h2>Catalog ({products.length})</h2><button className="admin-secondary" onClick={refresh}>Refresh</button></div>
          {loading ? <p className="admin-muted admin-pad">Loading products…</p> : products.length === 0 ? <p className="admin-muted admin-pad">No products found.</p> : (
            <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Eggless</th><th>Actions</th></tr></thead><tbody>{products.map((p) => <tr key={p._id}><td><div className="admin-product-cell">{p.image && <img src={p.image} alt="" loading="lazy" />}<div><strong>{p.name}</strong><small>{p.id}</small></div></div></td><td>{p.category}</td><td>₹{Number(p.price).toLocaleString('en-IN')}</td><td>{p.eggless ? 'Yes' : 'No'}</td><td><div className="admin-row-actions"><button className="admin-secondary" onClick={() => beginEdit(p)}>Edit</button><button className="admin-danger" onClick={() => removeProduct(p)}>Delete</button></div></td></tr>)}</tbody></table></div>
          )}
        </section>
        <p className="admin-footnote">Changes are saved to MongoDB. Refresh the storefront to see catalogue updates.</p>
      </section>
    </main>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    getAdminSession().then(setUser).catch(() => adminLogout()).finally(() => setChecking(false));
  }, []);
  function logout() { adminLogout(); setUser(null); }
  if (checking) return <main className="admin-shell"><p className="admin-muted">Checking admin session…</p></main>;
  if (!user) return <AdminLogin onLogin={setUser} />;
  return <ProductDashboard user={user} onLogout={logout} />;
}
