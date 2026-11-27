import Image from "next/image";
import styles from "./Toast.module.css";
import { ToastType } from "./ToastType";

type ToastProps = {
  message: string;
  icon?: string;
  onClose?: () => void;
  type?: ToastType;
};

export default function Toast({
  message,
  onClose,
  icon,
  type = ToastType.DEFAULT,
}: ToastProps) {
  return (
    <div
      className={`${styles.toast} ${type === ToastType.ERROR ? styles.error : ""}`}
      role="alert"
    >
      {icon && (
        <Image
          className={styles.icon}
          src={icon}
          alt="Toast icon"
          width={20}
          height={20}
        />
      )}
      <p className={styles.message}>{message}</p>
      {onClose && (
        <button
          className={styles.close}
          type="button"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}
