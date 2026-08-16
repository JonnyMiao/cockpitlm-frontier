export type SourceProviderName = "arxiv" | "openalex" | "crossref" | "openreview" | "acl" | "cvf" | "semantic-scholar";

export interface SourcePaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedAt: string;
  updatedAt: string;
  categories: string[];
  primaryCategory: string;
  comment: string | null;
  journalRef: string | null;
  doi: string | null;
  source: {
    provider: SourceProviderName;
    recordId: string;
    url: string;
    pdfUrl: string | null;
    retrievedAt: string;
  };
}

export interface TaxonomyMatch {
  slug: string;
  name: string;
  confidence: "high" | "medium" | "low";
  evidence: string[];
}

export interface CockpitMatch extends TaxonomyMatch {
  group: string;
  rationale: string;
}

export interface ResearchScore {
  value: 1 | 2 | 3 | 4 | 5;
  label: "Low" | "Moderate" | "Notable" | "High" | "Leading";
  explanation: string;
}

export interface ResearchIntelligence {
  summary: string;
  problem: string;
  contribution: string;
  whyItMatters: string;
  whatCanWeBorrow: string;
  cockpitTransfer: string;
  recommendedExperiment: string;
  strengths: string[];
  limitations: string[];
  scores: {
    frontier: ResearchScore;
    cockpit: ResearchScore;
    engineering: ResearchScore;
  };
  generatedBy: "deterministic-v1";
}

export interface EnrichedPaper extends SourcePaper {
  normalizedTitle: string;
  topics: TaxonomyMatch[];
  techniques: TaxonomyMatch[];
  cockpitTasks: CockpitMatch[];
  modalities: string[];
  trainingStages: string[];
  intelligence: ResearchIntelligence;
}

export interface PaperQuery {
  query?: string;
  topic?: string;
  technique?: string;
  cockpitTask?: string;
  modality?: string;
  category?: string;
  year?: string;
  frontier?: string;
  sort?: "newest" | "frontier" | "cockpit" | "engineering";
  page?: number;
  pageSize?: number;
}

export interface PaginatedPapers {
  items: EnrichedPaper[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface KnowledgeEntity {
  id: string;
  name: string;
  kind: "model" | "dataset" | "benchmark";
  organization: string;
  released: string;
  description: string;
  modalities: string[];
  attributes: Record<string, string>;
  topics: string[];
  cockpitSuitability: string;
  sourceUrl: string;
}
