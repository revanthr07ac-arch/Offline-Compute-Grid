import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ShowToastOptions {
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (opts: ShowToastOptions) => void;
}

// ── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Config per type ──────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  ToastType,
  { icon: React.ReactNode; color: string; border: string }
> = {
  success: {
    icon: <CheckCircle2 size={16} color="#10B981" />,
    color: "#10B981",
    border: "#10B981",
  },
  error: {
    icon: <XCircle size={16} color="#EF4444" />,
    color: "#EF4444",
    border: "#EF4444",
  },
  warning: {
    icon: <AlertTriangle size={16} color="#F59E0B" />,
    color: "#F59E0B",
    border: "#F59E0B",
  },
  info: {
    icon: <Info size={16} color="#0EA5E9" />,
    color: "#0EA5E9",
    border: "#0EA5E9",
  },
};

// ── Single toast item ────────────────────────────────────────────────────────

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const [visible, setVisible] = useState(true);
  const config = TYPE_CONFIG[toast.type];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    // allow fade-out before removing from DOM
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, toast.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss, toast.duration]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#FFFFFF",
        border: "1px solid #E6EAF0",
        borderLeft: `3px solid ${config.border}`,
        borderRadius: 14,
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.05)",
        padding: "12px 16px",
        width: "min(340px, calc(100vw - 32px))",
        animation: visible
          ? "toast-in 0.3s ease forwards"
          : "fadeIn 0.3s ease reverse forwards",
        transition: "opacity 0.3s ease",
        opacity: visible ? undefined : 0,
        flexShrink: 0,
      }}
      role="alert"
      aria-live="assertive"
    >
      <span style={{ flexShrink: 0 }}>{config.icon}</span>

      <span
        style={{
          flex: 1,
          fontSize: 14,
          color: "#111827",
          lineHeight: 1.45,
        }}
      >
        {toast.message}
      </span>

      <button
        onClick={dismiss}
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          color: "#98A2B3",
          borderRadius: 6,
        }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    ({ type, message, duration = 3500 }: ShowToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack */}
      <div
        style={{
          position: "fixed",
          top: "calc(env(safe-area-inset-top) + 16px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: "auto" }}>
            <ToastCard toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
