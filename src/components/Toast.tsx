import { X } from "lucide-react";
import { Button } from "./Button";

export type ToastMessage = {
  id: number;
  text: string;
  tone?: "success" | "warning" | "danger";
};

type ToastProps = {
  message: ToastMessage | null;
  onDismiss: () => void;
};

export function Toast({ message, onDismiss }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className={`toast toast--${message.tone ?? "success"}`}
      data-testid="toast"
      role="status"
    >
      <span>{message.text}</span>
      <Button aria-label="Dismiss" icon={<X size={16} />} onClick={onDismiss} size="sm" variant="ghost">
        OK
      </Button>
    </div>
  );
}
