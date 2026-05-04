import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  children: ReactNode;
  closeLabel: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({ children, closeLabel, isOpen, onClose, title }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" role="presentation" onMouseDown={onClose}>
      <section
        aria-modal="true"
        className="modal__panel"
        data-testid="matrix-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="modal__header">
          <h2>{title}</h2>
          <Button
            aria-label={closeLabel}
            icon={<X size={18} />}
            onClick={onClose}
            size="sm"
            variant="ghost"
          >
            {closeLabel}
          </Button>
        </div>
        <div className="modal__body">{children}</div>
      </section>
    </div>
  );
}
