import { TrendingDown, Type } from "lucide-react";

interface ToolStatsProps {
  originalCharCount: number;
  resultCharCount: number;
  originalLineCount: number;
  resultLineCount: number;
  duplicateLineCount: number;
  language?: "zh" | "en";
}

export function ToolStats({
  originalCharCount,
  resultCharCount,
  originalLineCount,
  resultLineCount,
  duplicateLineCount,
  language = "zh",
}: ToolStatsProps) {
  const removedChars = originalCharCount - resultCharCount;
  const removedLines = originalLineCount - resultLineCount;
  const reductionPercent =
    originalCharCount > 0
      ? Math.round((removedChars / originalCharCount) * 100)
      : 0;

  const labels = {
    zh: {
      original: "原始",
      result: "清洗后",
      chars: "字符",
      lines: "行",
      duplicate: "重复行",
      removed: "减少",
    },
    en: {
      original: "Original",
      result: "Result",
      chars: "chars",
      lines: "lines",
      duplicate: "duplicates",
      removed: "removed",
    },
  };

  const t = language === "zh" ? labels.zh : labels.en;

  return (
    <div className="tool-stats">
      <div className="tool-stats__item">
        <span className="tool-stats__label">{t.original} {t.chars}</span>
        <span className="tool-stats__value">{originalCharCount}</span>
      </div>
      <div className="tool-stats__item">
        <span className="tool-stats__label">{t.result} {t.chars}</span>
        <span className="tool-stats__value">{resultCharCount}</span>
      </div>
      <div className="tool-stats__item">
        <span className="tool-stats__label">{t.original} {t.lines}</span>
        <span className="tool-stats__value">{originalLineCount}</span>
      </div>
      <div className="tool-stats__item">
        <span className="tool-stats__label">{t.result} {t.lines}</span>
        <span className="tool-stats__value">{resultLineCount}</span>
      </div>
      <div className="tool-stats__item">
        <span className="tool-stats__label">{t.duplicate}</span>
        <span className="tool-stats__value">{duplicateLineCount}</span>
      </div>
      {removedChars > 0 && (
        <div className="tool-stats__item tool-stats__item--positive">
          <TrendingDown size={14} />
          <span className="tool-stats__label">{t.removed}</span>
          <span className="tool-stats__value">-{reductionPercent}%</span>
        </div>
      )}
    </div>
  );
}