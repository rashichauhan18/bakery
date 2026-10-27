import { useBakery } from '../context/BakeryContext';

export default function Toast() {
  const { toastMessage, isToastVisible } = useBakery();
  return (
    <div className={`toast-notification ${isToastVisible ? 'show' : ''}`} role="status" aria-live="polite">
      {toastMessage}
    </div>
  );
}
