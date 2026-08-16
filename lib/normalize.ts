import type { SourcePaper } from "@/types/research";

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeTitle(value: string): string {
  return normalizeWhitespace(value)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\bv\d+(?:\.\d+)?\b/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function normalizeDoi(value: string | null): string | null {
  if (!value) return null;
  return value.trim().toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi\.org\//, "");
}

export function normalizeArxivId(value: string): string {
  const last = value.split("/").at(-1) ?? value;
  return last.replace(/v\d+$/i, "");
}

export function canonicalPaperKey(paper: SourcePaper): string {
  const doi = normalizeDoi(paper.doi);
  if (doi) return `doi:${doi}`;
  if (paper.source.provider === "arxiv") return `arxiv:${normalizeArxivId(paper.source.recordId)}`;
  return `title:${normalizeTitle(paper.title)}:${paper.publishedAt.slice(0, 4)}`;
}

export function normalizePaper(paper: SourcePaper): SourcePaper {
  return {
    ...paper,
    id: canonicalPaperKey(paper),
    title: normalizeWhitespace(paper.title),
    authors: paper.authors.map(normalizeWhitespace).filter(Boolean),
    abstract: normalizeWhitespace(paper.abstract),
    categories: [...new Set(paper.categories.map(normalizeWhitespace).filter(Boolean))],
    doi: normalizeDoi(paper.doi),
    comment: paper.comment ? normalizeWhitespace(paper.comment) : null,
    journalRef: paper.journalRef ? normalizeWhitespace(paper.journalRef) : null,
  };
}
