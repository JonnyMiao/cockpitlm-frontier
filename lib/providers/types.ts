import type { SourcePaper, SourceProviderName } from "@/types/research";

export interface ProviderFetchOptions {
  query: string;
  limit: number;
  cursor?: string;
  since?: string;
}

export interface ProviderFetchResult {
  records: SourcePaper[];
  nextCursor?: string;
  total?: number;
}

export interface ResearchProvider {
  readonly name: SourceProviderName;
  fetch(options: ProviderFetchOptions): Promise<ProviderFetchResult>;
}
