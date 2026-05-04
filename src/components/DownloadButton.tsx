import { useState } from "react";
import { Check, Download } from "lucide-react";
import { Button } from "./Button";

type DownloadButtonProps = {
  content: string;
  fileName: string;
  label: string;
  mimeType?: string;
  onDownloaded?: () => void;
};

export function DownloadButton({
  content,
  fileName,
  label,
  mimeType = "application/json",
  onDownloaded,
}: DownloadButtonProps) {
  const [downloaded, setDownloaded] = useState(false);

  const onClick = () => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    onDownloaded?.();
    window.setTimeout(() => setDownloaded(false), 1600);
  };

  return (
    <Button
      data-download-state={downloaded ? "success" : "idle"}
      data-testid="download-button"
      icon={downloaded ? <Check size={17} /> : <Download size={17} />}
      onClick={onClick}
      variant={downloaded ? "primary" : "secondary"}
    >
      {label}
    </Button>
  );
}
