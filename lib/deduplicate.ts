import type { SourcePaper } from "@/types/research";
import { canonicalPaperKey, normalizeTitle } from "./normalize";

function authorOverlap(left: string[], right: string[]): number {
  const a = new Set(left.map((name) => name.toLowerCase()));
  const b = new Set(right.map((name) => name.toLowerCase()));
  if (!a.size || !b.size) return 0;
  const shared = [...a].filter((name) => b.has(name)).length;
  return shared / Math.min(a.size, b.size);
}

function richerRecord(left: SourcePaper, right: SourcePaper): SourcePaper {
  const leftWeight = Number(Boolean(left.doi)) * 3 + Number(Boolean(left.journalRef)) * 2 + left.abstract.length / 1000;
  const rightWeight = Number(Boolean(right.doi)) * 3 + Number(Boolean(right.journalRef)) * 2 + right.abstract.length / 1000;
  const preferred = rightWeight > leftWeight ? right : left;
  const other = preferred === left ? right : left;
  return {
    ...preferred,
    authors: preferred.authors.length >= other.authors.length ? preferred.authors : other.authors,
    categories: [...new Set([...preferred.categories, ...other.categories])],
    doi: preferred.doi ?? other.doi,
    journalRef: preferred.journalRef ?? other.journalRef,
    comment: preferred.comment ?? other.comment,
  };
}

export function deduplicatePapers(records: SourcePaper[]): SourcePaper[] {
  const exact = new Map<string, SourcePaper>();
  for (const record of records) {
    const key = canonicalPaperKey(record);
    exact.set(key, exact.has(key) ? richerRecord(exact.get(key)!, record) : record);
  }

  const result: SourcePaper[] = [];
  for (const candidate of exact.values()) {
    const candidateTitle = normalizeTitle(candidate.title);
    const duplicateIndex = result.findIndex((existing) => {
      if (candidate.publishedAt.slice(0, 4) !== existing.publishedAt.slice(0, 4)) return false;
      if (normalizeTitle(existing.title) !== candidateTitle) return false;
      return authorOverlap(existing.authors, candidate.authors) >= 0.5;
    });
    if (duplicateIndex >= 0) result[duplicateIndex] = richerRecord(result[duplicateIndex], candidate);
    else result.push(candidate);
  }
  return result;
}
