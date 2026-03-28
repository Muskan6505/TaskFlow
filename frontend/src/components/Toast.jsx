import { useEffect } from 'react';

const Toast = ({ message, type = 'error', duration = 4000, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-emerald-600/90' : 'bg-red-600/90';
  const textColor = 'text-white';

  return (
    <div className="fixed right-4 top-4 z-50 w-full max-w-sm sm:right-6 sm:top-6">
      <div className={`${bgColor} ${textColor} px-4 py-3 rounded-xl shadow-xl border border-white/20 backdrop-blur-lg transition transform duration-300`} role="alert">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium">{message}</p>
          <button onClick={onClose} className="text-white/90 hover:text-white focus:outline-none" aria-label="Close notification">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
