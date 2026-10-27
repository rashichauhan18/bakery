import { useEffect, useState } from 'react';
import { customerLogin, customerRegister, getCustomerSession, customerLogout } from '../services/customerAuthApi';
import './customer-auth.css';

export default function CustomerAuth() {
  const [mode, setMode] = useState(window.location.pathname.replace(/\/+$/, '') === '/register' ? 'register' : 'login');
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let mounted = true;
    getCustomerSession().then((value) => { if (mounted) setUser(value); }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
    window.history.replaceState({}, '', nextMode === 'register' ? '/register' : '/login');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const account = mode === 'register'
        ? await customerRegister({ name, email, password })
        : await customerLogin(email, password);
      if (account.role === 'admin') {
        setNotice('This is an administrator account. Opening the admin dashboard…');
        window.location.assign('/admin');
        return;
      }
      setUser(account);
      setPassword('');
      setNotice(mode === 'register' ? 'Your customer account has been created.' : 'You are signed in.');
      window.history.replaceState({}, '', '/account');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    customerLogout();
    setUser(null);
    setMode('login');
    setNotice('You have signed out.');
    window.history.replaceState({}, '', '/login');
  }

  return (
    <main className="customer-auth-page">
      <section className="customer-auth-card">
        <a className="customer-auth-brand" href="/" aria-label="Back to bakery home">Theobroma <span>Patisserie</span></a>
        {user ? (
          <div className="customer-auth-account">
            <div className="customer-auth-mark" aria-hidden="true">✓</div>
            <p className="customer-auth-eyebrow">CUSTOMER ACCOUNT</p>
            <h1>Welcome, {user.name}</h1>
            <p className="customer-auth-muted">Signed in as {user.email}</p>
            {notice && <p className="customer-auth-notice">{notice}</p>}
            <p className="customer-auth-muted">You can continue shopping on the bakery storefront. Checkout remains available to guest users too.</p>
            <div className="customer-auth-actions">
              <a className="customer-auth-primary" href="/">Continue shopping</a>
              <button className="customer-auth-secondary" type="button" onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        ) : (
          <>
            <p className="customer-auth-eyebrow">YOUR BAKERY ACCOUNT</p>
            <h1>{mode === 'register' ? 'Create an account' : 'Welcome back'}</h1>
            <p className="customer-auth-muted">{mode === 'register' ? 'Create a customer account to sign in to the bakery.' : 'Sign in to your customer account.'}</p>
            <div className="customer-auth-tabs">
              <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Sign in</button>
              <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Create account</button>
            </div>
            <form onSubmit={handleSubmit} className="customer-auth-form">
              {mode === 'register' && (
                <label>Full name<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required /></label>
              )}
              <label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
              <label>Password<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} maxLength={72} required /></label>
              {mode === 'register' && <p className="customer-auth-help">Use at least 8 characters. New registrations always receive the customer role.</p>}
              {error && <p className="customer-auth-error" role="alert">{error}</p>}
              {notice && <p className="customer-auth-notice" role="status">{notice}</p>}
              <button className="customer-auth-primary" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create customer account' : 'Sign in'}</button>
            </form>
            <p className="customer-auth-footnote">Admin? Use <a href="/admin">the administrator login</a>.</p>
          </>
        )}
        <a className="customer-auth-home" href="/">← Back to the storefront</a>
      </section>
    </main>
  );
}
