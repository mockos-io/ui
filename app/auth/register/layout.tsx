import type { ReactNode } from "react";
import { RegisterProvider } from "./context/RegisterContext";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <RegisterProvider>{children}</RegisterProvider>;
}
