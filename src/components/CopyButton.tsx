import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./Button";

type CopyButtonProps = {
  copiedLabel: string;
  label: string;
  onCopied?: () => void;
  onError?: () => void;
  text: string;
};

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Copy command was blocked.");
  }
}

export function CopyButton({
  copiedLabel,
  label,
  onCopied,
  onError,
  text,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");

  const onClick = async () => {
    try {
      await copyText(text);
      setState("success");
      onCopied?.();
      window.setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("error");
      onError?.();
      window.setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <Button
      data-copy-state={state}
      data-testid="copy-button"
      icon={state === "success" ? <Check size={17} /> : <Copy size={17} />}
      onClick={onClick}
      variant={state === "success" ? "primary" : "secondary"}
    >
      {state === "success" ? copiedLabel : label}
    </Button>
  );
}
