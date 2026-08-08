import sourcePapers from "@/data/papers.json";
import type { EnrichedPaper, PaginatedPapers, PaperQuery, SourcePaper } from "@/types/research";
import { enrichPaper } from "./classify";

const corpus = (sourcePapers as SourcePaper[]).map(enrichPaper);

function includes(value: string | undefined, candidate: string): boolean {
  return !value || value === "all" || candidate.toLowerCase() === value.toLowerCase();
}

export function allPapers(): EnrichedPaper[] {
  return corpus;
}

export function listPapers(query: PaperQuery = {}): PaginatedPapers {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(10, Math.min(50, query.pageSize ?? 25));
  const needle = query.query?.trim().toLowerCase();
  let filtered = corpus.filter((paper) => {
    const haystack = `${paper.title} ${paper.abstract} ${paper.authors.join(" ")} ${paper.topics.map((item) => item.name).join(" ")} ${paper.techniques.map((item) => item.name).join(" ")}`.toLowerCase();
    if (needle && !haystack.includes(needle)) return false;
    if (query.topic && query.topic !== "all" && !paper.topics.some((item) => includes(query.topic, item.slug))) return false;
    if (query.technique && query.technique !== "all" && !paper.techniques.some((item) => includes(query.technique, item.slug))) return false;
    if (query.cockpitTask && query.cockpitTask !== "all" && !paper.cockpitTasks.some((item) => includes(query.cockpitTask, item.slug))) return false;
    if (query.modality && query.modality !== "all" && !paper.modalities.some((item) => includes(query.modality, item))) return false;
    if (query.category && query.category !== "all" && paper.primaryCategory !== query.category) return false;
    if (query.year && query.year !== "all" && !paper.publishedAt.startsWith(query.year)) return false;
    if (query.frontier && Number(query.frontier) > paper.intelligence.scores.frontier.value) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (query.sort === "frontier") return b.intelligence.scores.frontier.value - a.intelligence.scores.frontier.value || b.publishedAt.localeCompare(a.publishedAt);
    if (query.sort === "cockpit") return b.intelligence.scores.cockpit.value - a.intelligence.scores.cockpit.value || b.publishedAt.localeCompare(a.publishedAt);
    if (query.sort === "engineering") return b.intelligence.scores.engineering.value - a.intelligence.scores.engineering.value || b.publishedAt.localeCompare(a.publishedAt);
    return b.publishedAt.localeCompare(a.publishedAt);
  });
  const total = filtered.length;
  return { items: filtered.slice((page - 1) * pageSize, page * pageSize), page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export function getPaper(id: string): EnrichedPaper | undefined {
  const decoded = decodeURIComponent(id);
  return corpus.find((paper) => paper.id === decoded || paper.source.recordId.replace(/v\d+$/i, "") === decoded);
}

export function getDashboardStats() {
  const newest = corpus[0]?.publishedAt ? Date.parse(corpus[0].publishedAt) : Date.now();
  const weekStart = newest - 7 * 86_400_000;
  return {
    total: corpus.length,
    newThisWeek: corpus.filter((paper) => Date.parse(paper.publishedAt) >= weekStart).length,
    mustRead: corpus.filter((paper) => paper.intelligence.scores.frontier.value >= 4).length,
    cockpitRelevant: corpus.filter((paper) => paper.intelligence.scores.cockpit.value >= 4).length,
    newModels: 6,
    latestSourceUpdate: corpus.map((paper) => paper.source.retrievedAt).sort().at(-1) ?? "Unavailable",
  };
}

export interface TopicTrend {
  slug: string;
  name: string;
  recent: number;
  previous: number;
  growth: number | null;
  status: "Emerging" | "Rising" | "Active" | "Mature" | "Insufficient sample";
  cockpit: number;
  papers: EnrichedPaper[];
}

export function topicTrends(): TopicTrend[] {
  if (!corpus.length) return [];
  const newest = Math.max(...corpus.map((paper) => Date.parse(paper.publishedAt)));
  const recentStart = newest - 90 * 86_400_000;
  const previousStart = recentStart - 90 * 86_400_000;
  const topicMap = new Map<string, TopicTrend>();
  for (const paper of corpus) {
    for (const topic of paper.topics) {
      if (!topicMap.has(topic.slug)) topicMap.set(topic.slug, { slug: topic.slug, name: topic.name, recent: 0, previous: 0, growth: null, status: "Insufficient sample", cockpit: 0, papers: [] });
      const row = topicMap.get(topic.slug)!;
      const date = Date.parse(paper.publishedAt);
      if (date >= recentStart) row.recent += 1;
      else if (date >= previousStart) row.previous += 1;
      if (paper.intelligence.scores.cockpit.value >= 4) row.cockpit += 1;
      if (row.papers.length < 4) row.papers.push(paper);
    }
  }
  return [...topicMap.values()].map((row) => {
    const sample = row.recent + row.previous;
    const growth = row.previous > 0 ? Math.round(((row.recent - row.previous) / row.previous) * 100) : null;
    let status: TopicTrend["status"] = "Insufficient sample";
    if (sample >= 8) status = growth !== null && growth >= 40 ? "Rising" : row.recent >= 10 ? "Active" : "Mature";
    else if (row.recent >= 4 && row.previous <= 1) status = "Emerging";
    return { ...row, growth, status };
  }).sort((a, b) => b.recent - a.recent);
}

export function searchSuggestions(query: string): EnrichedPaper[] {
  if (!query.trim()) return [];
  return listPapers({ query, pageSize: 12, sort: "frontier" }).items;
}
