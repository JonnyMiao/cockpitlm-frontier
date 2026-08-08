import type { CockpitMatch, ResearchScore, SourcePaper, TaxonomyMatch } from "@/types/research";

const LABELS = ["Low", "Moderate", "Notable", "High", "Leading"] as const;

function score(value: number, explanation: string): ResearchScore {
  const bounded = Math.max(1, Math.min(5, Math.round(value))) as 1 | 2 | 3 | 4 | 5;
  return { value: bounded, label: LABELS[bounded - 1], explanation };
}

export function scoreFrontier(paper: SourcePaper, topics: TaxonomyMatch[]): ResearchScore {
  const ageDays = Math.max(0, (Date.now() - Date.parse(paper.publishedAt)) / 86_400_000);
  const recent = ageDays <= 120 ? 2 : ageDays <= 365 ? 1 : 0;
  const signal = topics.some((topic) => ["native-omni", "world-model", "multimodal-agent", "video-vlm"].includes(topic.slug)) ? 1 : 0;
  const venue = paper.journalRef ? 1 : 0;
  return score(2 + recent + signal + venue * 0.5, `${ageDays <= 120 ? "Recent release" : "Established work"}; ${topics.slice(0, 2).map((topic) => topic.name).join(" and ") || "multimodal foundation"} signal. This is a transparent heuristic, not a citation ranking.`);
}

export function scoreCockpit(tasks: CockpitMatch[]): ResearchScore {
  if (!tasks.length) return score(1, "No direct cockpit-transfer signal was detected in the source title or abstract.");
  const direct = tasks.some((task) => ["driver-state", "cockpit-agent", "edge-deployment", "multi-camera"].includes(task.slug));
  return score(2 + Math.min(2, tasks.length) + (direct ? 1 : 0), `Transfer evidence: ${tasks.slice(0, 3).map((task) => task.name).join(", ")}.`);
}

export function scoreEngineering(paper: SourcePaper, techniques: TaxonomyMatch[]): ResearchScore {
  const text = `${paper.comment ?? ""} ${paper.abstract}`.toLowerCase();
  const codeSignal = /github|code is available|open source|open-source/.test(text);
  const deploymentSignal = techniques.some((technique) => ["quantization", "token-compression", "knowledge-distillation"].includes(technique.slug));
  const reproducibility = Number(Boolean(paper.comment)) + Number(Boolean(paper.journalRef));
  return score(1 + Number(codeSignal) * 2 + Number(deploymentSignal) + Math.min(1, reproducibility), `${codeSignal ? "Source mentions public implementation or release material" : "No code availability was verified from the ingested record"}; ${deploymentSignal ? "deployment-oriented method detected" : "deployment recipe not reported"}.`);
}
