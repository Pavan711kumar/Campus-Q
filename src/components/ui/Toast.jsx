import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, tone = 'success') => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="glass flex items-center justify-between gap-3 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className={toast.tone === 'error' ? 'text-red-600' : 'text-green-600'} size={20} />
              <p className="text-sm font-semibold text-stone-800">{toast.message}</p>
            </div>
            <button onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
