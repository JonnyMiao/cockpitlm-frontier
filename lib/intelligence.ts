import type { CockpitMatch, ResearchIntelligence, SourcePaper, TaxonomyMatch } from "@/types/research";
import { scoreCockpit, scoreEngineering, scoreFrontier } from "./scoring";

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).map((item) => item.trim()).filter(Boolean);
}

function contributionSentence(abstract: string): string {
  const parts = sentences(abstract);
  return parts.find((part) => /\b(we propose|we present|we introduce|this work|our method|we develop)\b/i.test(part)) ?? parts[0] ?? "Not reported in the source abstract.";
}

export function buildIntelligence(
  paper: SourcePaper,
  topics: TaxonomyMatch[],
  techniques: TaxonomyMatch[],
  cockpitTasks: CockpitMatch[],
): ResearchIntelligence {
  const parts = sentences(paper.abstract);
  const summary = parts[0] ?? "Abstract unavailable.";
  const contribution = contributionSentence(paper.abstract);
  const transferable = techniques[0]?.name ?? topics[0]?.name ?? "multimodal representation learning";
  const target = cockpitTasks[0]?.name;
  return {
    summary,
    problem: parts.slice(0, 2).join(" ") || "Not reported in the source abstract.",
    contribution,
    whyItMatters: `The work contributes to ${topics.slice(0, 2).map((topic) => topic.name).join(" and ") || "multimodal research"}. Read the paper for verified experimental claims.`,
    whatCanWeBorrow: `Evaluate the ${transferable} design independently before reproducing the full training recipe.`,
    cockpitTransfer: target ? `${transferable} may transfer to ${target.toLowerCase()}. ${cockpitTasks[0].rationale}` : "No strong cockpit transfer was detected automatically; expert review is recommended.",
    recommendedExperiment: target ? `Run a controlled ${target.toLowerCase()} pilot: freeze the backbone first, adapt the connector, then compare latency, memory and task accuracy against a task-specific baseline.` : "Reproduce one reported task first, then test domain shift on a small, leakage-controlled cockpit sample.",
    strengths: [contribution, paper.categories.length > 1 ? "Addresses multiple indexed research categories." : "Has a clearly indexed primary research category."],
    limitations: ["Analysis is derived only from public source metadata and abstract text.", paper.comment ? "Engineering artifacts require independent verification." : "Code, weights and training recipe were not reported in the ingested metadata."],
    scores: {
      frontier: scoreFrontier(paper, topics),
      cockpit: scoreCockpit(cockpitTasks),
      engineering: scoreEngineering(paper, techniques),
    },
    generatedBy: "deterministic-v1",
  };
}
