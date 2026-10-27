import { BakeryProvider } from './context/BakeryContext';
import BakeryPage from './pages/BakeryPage';
import AdminApp from './admin/AdminApp';
import CustomerAuth from './auth/CustomerAuth';
import './admin/admin.css';

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/admin' || path === '/admin/login') {
    return <AdminApp />;
  }

  if (path === '/login' || path === '/register' || path === '/account') {
    return <CustomerAuth />;
  }

  return (
    <BakeryProvider>
      <BakeryPage />
    </BakeryProvider>
  );
}
