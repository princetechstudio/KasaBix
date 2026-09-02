import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ToastCtx = createContext<{ push: (message: string, type?: ToastType) => void }>({
  push: () => {},
});

export const useToast = () => useContext(ToastCtx);

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-sky-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
};

const BARS: Record<ToastType, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, message, type }]);
    window.setTimeout(() => dismiss(id), 3800);
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 bottom-20 z-[90] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:items-end lg:bottom-5"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-2 shadow-lg shadow-slate-900/10 animate-slide-up dark:border-slate-700 dark:bg-slate-900"
          >
            <span className={`absolute left-0 top-0 h-full w-1 ${BARS[t.type]}`} />
            {ICONS[t.type]}
            <p className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
