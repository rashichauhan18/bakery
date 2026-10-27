import { BakeryProvider } from './context/BakeryContext';
import BakeryPage from './pages/BakeryPage';

// Keep App.jsx as the application composition root.
// UI, state management, and API calls live in their own files.
export default function App() {
  return (
    <BakeryProvider>
      <BakeryPage />
    </BakeryProvider>
  );
}
