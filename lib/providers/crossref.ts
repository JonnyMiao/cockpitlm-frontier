import type { SourcePaper } from "@/types/research";
import type { ProviderFetchOptions, ProviderFetchResult, ResearchProvider } from "./types";

type CrossrefItem = {
  DOI: string;
  URL: string;
  title?: string[];
  abstract?: string;
  author?: Array<{ given?: string; family?: string }>;
  published?: { "date-parts"?: number[][] };
  created?: { "date-time"?: string };
  "container-title"?: string[];
  subject?: string[];
};

export class CrossrefProvider implements ResearchProvider {
  readonly name = "crossref" as const;

  async fetch(options: ProviderFetchOptions): Promise<ProviderFetchResult> {
    const rows = Math.min(options.limit, 1000);
    const params = new URLSearchParams({ query: options.query, rows: String(rows), cursor: options.cursor ?? "*", "cursor-max": String(rows) });
    const response = await fetch(`https://api.crossref.org/works?${params}`, { headers: { "User-Agent": "CockpitLM-Frontier/0.1" }, signal: AbortSignal.timeout(45_000) });
    if (!response.ok) throw new Error(`Crossref returned ${response.status}`);
    const payload = await response.json() as { message: { items: CrossrefItem[]; "next-cursor"?: string; "total-results"?: number } };
    const retrievedAt = new Date().toISOString();
    const records: SourcePaper[] = payload.message.items.map((item) => {
      const dateParts = item.published?.["date-parts"]?.[0] ?? [];
      const publishedAt = dateParts.length ? `${dateParts[0]}-${String(dateParts[1] ?? 1).padStart(2, "0")}-${String(dateParts[2] ?? 1).padStart(2, "0")}` : "Unavailable";
      return {
        id: `doi:${item.DOI.toLowerCase()}`,
        title: item.title?.[0] ?? "Untitled",
        authors: item.author?.map((author) => `${author.given ?? ""} ${author.family ?? ""}`.trim()).filter(Boolean) ?? [],
        abstract: item.abstract?.replace(/<[^>]+>/g, " ") ?? "Unavailable",
        publishedAt,
        updatedAt: item.created?.["date-time"] ?? publishedAt,
        categories: item.subject ?? [],
        primaryCategory: item["container-title"]?.[0] ?? "Unknown",
        comment: null,
        journalRef: item["container-title"]?.[0] ?? null,
        doi: item.DOI,
        source: { provider: "crossref", recordId: item.DOI, url: item.URL, pdfUrl: null, retrievedAt },
      };
    });
    return { records, nextCursor: payload.message["next-cursor"], total: payload.message["total-results"] };
  }
}
