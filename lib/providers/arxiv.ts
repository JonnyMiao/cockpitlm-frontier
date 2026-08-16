import { XMLParser } from "fast-xml-parser";
import type { SourcePaper } from "@/types/research";
import type { ProviderFetchOptions, ProviderFetchResult, ResearchProvider } from "./types";

type XmlNode = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  attributeNamePrefix: "@_",
  isArray: (_name, path) => ["feed.entry", "feed.entry.author", "feed.entry.category", "feed.entry.link"].includes(String(path)),
});

function text(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "#text" in value) return String((value as XmlNode)["#text"] ?? "");
  return value == null ? "" : String(value);
}

function array<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function toSourcePaper(entry: XmlNode, retrievedAt: string): SourcePaper {
  const idUrl = text(entry.id);
  const recordId = idUrl.split("/abs/").at(-1) ?? idUrl;
  const links = array(entry.link as XmlNode[] | undefined);
  const categories = array(entry.category as XmlNode[] | undefined).map((category) => text(category["@_term"])).filter(Boolean);
  const authors = array(entry.author as XmlNode[] | undefined).map((author) => text(author.name)).filter(Boolean);
  const primaryCategory = entry.primary_category as XmlNode | undefined;
  const alternate = links.find((link) => link["@_rel"] === "alternate");
  const pdf = links.find((link) => link["@_title"] === "pdf" || link["@_type"] === "application/pdf");
  return {
    id: `arxiv:${recordId.replace(/v\d+$/i, "")}`,
    title: text(entry.title),
    authors,
    abstract: text(entry.summary),
    publishedAt: text(entry.published),
    updatedAt: text(entry.updated),
    categories,
    primaryCategory: text(primaryCategory?.["@_term"]) || categories[0] || "Unknown",
    comment: text(entry.comment) || null,
    journalRef: text(entry.journal_ref) || null,
    doi: text(entry.doi) || null,
    source: {
      provider: "arxiv",
      recordId,
      url: text(alternate?.["@_href"]) || idUrl,
      pdfUrl: text(pdf?.["@_href"]) || null,
      retrievedAt,
    },
  };
}

export function parseArxivFeed(xml: string, retrievedAt: string): SourcePaper[] {
  const body = parser.parse(xml) as { feed?: XmlNode };
  const feed = body.feed ?? {};
  return array(feed.entry as XmlNode[] | undefined).map((entry) => toSourcePaper(entry, retrievedAt));
}

export class ArxivProvider implements ResearchProvider {
  readonly name = "arxiv" as const;

  async fetch(options: ProviderFetchOptions): Promise<ProviderFetchResult> {
    const start = Number(options.cursor ?? "0");
    const params = new URLSearchParams({
      search_query: options.query,
      start: String(start),
      max_results: String(Math.min(options.limit, 300)),
      sortBy: "submittedDate",
      sortOrder: "descending",
    });
    const response = await fetch(`https://export.arxiv.org/api/query?${params}`, {
      headers: { "User-Agent": "CockpitLM-Frontier/0.1 (research metadata ingestion)" },
      signal: AbortSignal.timeout(45_000),
    });
    if (!response.ok) throw new Error(`arXiv returned ${response.status}`);
    const retrievedAt = new Date().toISOString();
    const xml = await response.text();
    const body = parser.parse(xml) as { feed?: XmlNode };
    const feed = body.feed ?? {};
    const records = parseArxivFeed(xml, retrievedAt);
    const total = Number(text((feed.total as XmlNode | undefined)?.["#text"] ?? feed.total)) || undefined;
    const next = records.length === Math.min(options.limit, 300) ? String(start + records.length) : undefined;
    return { records, total, nextCursor: next };
  }
}
