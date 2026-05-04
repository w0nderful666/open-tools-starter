import type { ReactNode } from "react";

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  level: "C" | "B" | "A";
  category: string;
  tags: string[];
  localFirst: boolean;
  noBackend: boolean;
  component: () => ReactNode;
}

export const registeredTools: ToolDefinition[] = [];

export function registerTool(tool: ToolDefinition): void {
  registeredTools.push(tool);
}

export function getToolById(id: string): ToolDefinition | undefined {
  return registeredTools.find((t) => t.id === id);
}

export function getToolsByLevel(level: "C" | "B" | "A"): ToolDefinition[] {
  return registeredTools.filter((t) => t.level === level);
}
