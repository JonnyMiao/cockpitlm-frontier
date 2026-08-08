import type { ResearchScore } from "@/types/research";

export function Score({ label, score, compact = false }: { label: string; score: ResearchScore; compact?: boolean }) {
  return (
    <div className={`score ${compact ? "score-compact" : ""}`} title={score.explanation}>
      <div className="score-label"><span>{label}</span><strong>{score.value}/5</strong></div>
      <div className="score-track" aria-label={`${label}: ${score.value} out of 5`}><span style={{ width: `${score.value * 20}%` }} /></div>
      {!compact && <small>{score.explanation}</small>}
    </div>
  );
}
