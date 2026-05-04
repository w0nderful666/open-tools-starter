import { type ReactNode } from "react";
import { Card } from "@/components/Card";

interface ToolShellProps {
  children: ReactNode;
  className?: string;
}

export function ToolShell({ children, className = "" }: ToolShellProps) {
  return (
    <Card className={`tool-shell ${className}`}>
      <div className="tool-shell__content">{children}</div>
    </Card>
  );
}