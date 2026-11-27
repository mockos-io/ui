"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Toast from "./Toast";
import styles from "./Toast.module.css";
import { ToastType } from "./ToastType";

type ToastContextValue = {
  showToast: (
    message: string,
    durationMs?: number,
    icon?: string,
    type?: ToastType,
  ) => number;
  dismissToast: (id: number) => void;
};

type ActiveToast = {
  id: number;
  message: string;
  icon?: string;
  type: ToastType;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const idRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      durationMs = 5000,
      icon?: string,
      type: ToastType = ToastType.DEFAULT,
    ) => {
      const id = ++idRef.current;
      setToasts((current) => [...current, { id, message, icon, type }]);

      if (durationMs > 0) {
        const timer = setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id));
          timersRef.current.delete(id);
        }, durationMs);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [],
  );

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {toasts.length > 0 && (
        <div className={styles.stack}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              icon={toast.icon}
              type={toast.type}
              onClose={() => dismissToast(toast.id)}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
