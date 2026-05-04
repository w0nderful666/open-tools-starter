import { CheckCircle2, Shield } from "lucide-react";

interface ToolHeaderProps {
  name: string;
  description: string;
  level: string;
  localFirst?: boolean;
  noBackend?: boolean;
  language?: "zh" | "en";
}

export function ToolHeader({
  name,
  description,
  level,
  localFirst = true,
  noBackend = true,
  language = "zh",
}: ToolHeaderProps) {
  const badges = [
    { show: localFirst, label: language === "zh" ? "本地优先" : "Local First", key: "local" },
    { show: noBackend, label: language === "zh" ? "无后端" : "No Backend", key: "backend" },
    { show: true, label: `Level ${level}`, key: "level" },
  ].filter((b) => b.show);

  return (
    <div className="tool-header">
      <div className="tool-header__info">
        <h3 className="tool-header__name">{name}</h3>
        <p className="tool-header__desc">{description}</p>
      </div>
      <div className="tool-header__badges">
        {badges.map((badge) => (
          <span className="tool-badge" key={badge.key}>
            {badge.key === "local" && <Shield size={12} />}
            {badge.key === "backend" && <CheckCircle2 size={12} />}
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}