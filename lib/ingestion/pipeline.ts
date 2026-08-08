import { z } from "zod";
import type { ResearchProvider } from "@/lib/providers/types";
import type { SourcePaper } from "@/types/research";
import { deduplicatePapers } from "@/lib/deduplicate";
import { normalizePaper } from "@/lib/normalize";

const sourcePaperSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  authors: z.array(z.string()),
  abstract: z.string(),
  publishedAt: z.string().min(4),
  updatedAt: z.string().min(4),
  categories: z.array(z.string()),
  primaryCategory: z.string().min(1),
  comment: z.string().nullable(),
  journalRef: z.string().nullable(),
  doi: z.string().nullable(),
  source: z.object({
    provider: z.enum(["arxiv", "openalex", "crossref", "openreview", "acl", "cvf", "semantic-scholar"]),
    recordId: z.string().min(1),
    url: z.string().url(),
    pdfUrl: z.string().url().nullable(),
    retrievedAt: z.string().min(4),
  }),
});

export interface IngestionReport {
  provider: string;
  fetched: number;
  accepted: number;
  rejected: number;
  deduplicated: number;
  records: SourcePaper[];
}

export async function runProviderIngestion(provider: ResearchProvider, query: string, limit: number): Promise<IngestionReport> {
  const collected: SourcePaper[] = [];
  let cursor: string | undefined;
  while (collected.length < limit) {
    const remaining = limit - collected.length;
    const result = await provider.fetch({ query, limit: Math.min(remaining, 300), cursor });
    collected.push(...result.records);
    if (!result.nextCursor || !result.records.length) break;
    cursor = result.nextCursor;
    if (provider.name === "arxiv") await new Promise((resolve) => setTimeout(resolve, 3_100));
  }

  const valid = collected.flatMap((record) => {
    const parsed = sourcePaperSchema.safeParse(record);
    return parsed.success ? [normalizePaper(parsed.data)] : [];
  });
  const records = deduplicatePapers(valid);
  return {
    provider: provider.name,
    fetched: collected.length,
    accepted: valid.length,
    rejected: collected.length - valid.length,
    deduplicated: valid.length - records.length,
    records,
  };
}
