"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type RegisterContextValue = {
  email: string | null;
  setEmail: (email: string) => void;
};

const RegisterContext = createContext<RegisterContextValue | null>(null);

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <RegisterContext.Provider value={{ email, setEmail }}>
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);

  if (!context) {
    throw new Error("useRegister must be used within a RegisterProvider");
  }

  return context;
}
