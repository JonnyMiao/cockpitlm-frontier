import type { ResearchScore } from "@/types/research";
import type { Locale } from "@/lib/i18n";
import { scoreLabel, t } from "@/lib/i18n";

export function Score({ label, score, compact = false, locale = "en" }: { label: string; score: ResearchScore; compact?: boolean; locale?: Locale }) {
  return (
    <div className={`score ${compact ? "score-compact" : ""}`} title={score.explanation}>
      <div className="score-label"><span>{label}</span><strong>{score.value}/5</strong></div>
      <div className="score-track" aria-label={t(locale, `${label}：${score.value} / 5（${scoreLabel(locale, score.label)}）`, `${label}: ${score.value} out of 5`)}><span style={{ width: `${score.value * 20}%` }} /></div>
      {!compact && <small>{locale === "zh" ? `${scoreLabel(locale, score.label)} · 透明启发式评分，非基准测试结果。` : score.explanation}</small>}
    </div>
  );
}
