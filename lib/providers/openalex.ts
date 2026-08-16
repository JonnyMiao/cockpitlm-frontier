import type { SourcePaper } from "@/types/research";
import type { ProviderFetchOptions, ProviderFetchResult, ResearchProvider } from "./types";

type OpenAlexWork = {
  id: string;
  doi: string | null;
  title: string;
  publication_date: string;
  updated_date: string;
  primary_location?: { landing_page_url?: string | null; pdf_url?: string | null; source?: { display_name?: string } };
  authorships?: Array<{ author?: { display_name?: string } }>;
  concepts?: Array<{ display_name?: string }>;
  open_access?: { oa_url?: string | null };
};

export class OpenAlexProvider implements ResearchProvider {
  readonly name = "openalex" as const;

  async fetch(options: ProviderFetchOptions): Promise<ProviderFetchResult> {
    const params = new URLSearchParams({ search: options.query, per_page: String(Math.min(options.limit, 200)), cursor: options.cursor ?? "*" });
    const response = await fetch(`https://api.openalex.org/works?${params}`, { signal: AbortSignal.timeout(45_000) });
    if (!response.ok) throw new Error(`OpenAlex returned ${response.status}`);
    const payload = await response.json() as { results: OpenAlexWork[]; meta?: { next_cursor?: string; count?: number } };
    const retrievedAt = new Date().toISOString();
    const records: SourcePaper[] = payload.results.map((work) => ({
      id: `openalex:${work.id.split("/").at(-1)}`,
      title: work.title,
      authors: work.authorships?.map((item) => item.author?.display_name ?? "").filter(Boolean) ?? [],
      abstract: "Unavailable",
      publishedAt: work.publication_date,
      updatedAt: work.updated_date,
      categories: work.concepts?.map((concept) => concept.display_name ?? "").filter(Boolean) ?? [],
      primaryCategory: work.primary_location?.source?.display_name ?? "Unknown",
      comment: null,
      journalRef: work.primary_location?.source?.display_name ?? null,
      doi: work.doi,
      source: {
        provider: "openalex",
        recordId: work.id.split("/").at(-1) ?? work.id,
        url: work.primary_location?.landing_page_url ?? work.id,
        pdfUrl: work.primary_location?.pdf_url ?? work.open_access?.oa_url ?? null,
        retrievedAt,
      },
    }));
    return { records, total: payload.meta?.count, nextCursor: payload.meta?.next_cursor };
  }
}
