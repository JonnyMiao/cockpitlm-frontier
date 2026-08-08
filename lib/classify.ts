import type { EnrichedPaper, SourcePaper } from "@/types/research";
import { buildIntelligence } from "./intelligence";
import { normalizeTitle } from "./normalize";
import { classifyCockpitTasks, classifyModalities, classifyTechniques, classifyTopics, classifyTrainingStages } from "./taxonomy";

export function enrichPaper(paper: SourcePaper): EnrichedPaper {
  const topics = classifyTopics(paper);
  const techniques = classifyTechniques(paper);
  const cockpitTasks = classifyCockpitTasks(paper);
  return {
    ...paper,
    normalizedTitle: normalizeTitle(paper.title),
    topics,
    techniques,
    cockpitTasks,
    modalities: classifyModalities(paper),
    trainingStages: classifyTrainingStages(paper),
    intelligence: buildIntelligence(paper, topics, techniques, cockpitTasks),
  };
}
