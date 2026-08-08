import type { Metadata } from "next";
import { Filter, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { PaperTable } from "@/components/PaperTable";
import { allPapers, listPapers } from "@/lib/repository";
import { COCKPIT_RULES, TOPIC_RULES } from "@/lib/taxonomy";

export const metadata: Metadata = { title: "Papers", description: "Search and filter the CockpitLM Frontier research corpus." };

type SearchParams = Record<string, string | string[] | undefined>;
const value = (params: SearchParams, key: string) => typeof params[key] === "string" ? params[key] : undefined;

export default async function PapersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const raw = await searchParams;
  const query = {
    query: value(raw, "q"), topic: value(raw, "topic"), cockpitTask: value(raw, "cockpit"), modality: value(raw, "modality"),
    category: value(raw, "category"), year: value(raw, "year"), frontier: value(raw, "frontier"),
    sort: (value(raw, "sort") ?? "newest") as "newest" | "frontier" | "cockpit" | "engineering",
    page: Number(value(raw, "page") ?? 1), pageSize: 25,
  };
  const result = listPapers(query);
  const corpus = allPapers();
  const years = [...new Set(corpus.map((paper) => paper.publishedAt.slice(0, 4)))].filter((year) => /^\d{4}$/.test(year)).sort().reverse();
  const categories = [...new Set(corpus.map((paper) => paper.primaryCategory))].sort().slice(0, 30);
  const flatParams = Object.fromEntries(Object.entries(raw).flatMap(([key, item]) => typeof item === "string" && key !== "page" ? [[key, item]] : []));
  return (
    <>
      <PageHeader eyebrow="Research corpus" title="All papers" description="Source-traceable multimodal research with deterministic taxonomy, three independent decision scores and cockpit-transfer analysis." meta={<><span>{result.total.toLocaleString()} matching records</span><span>25 per page · server-side filtering</span><span>Latest source ingest: {corpus[0]?.source.retrievedAt.slice(0, 10) ?? "Unavailable"}</span></>} />
      <section className="section papers-workspace">
        <div className="container-wide">
          <form className="filter-panel" action="/papers">
            <div className="filter-search"><Search size={15} /><input name="q" defaultValue={query.query} placeholder="Title, abstract, author, method…" /></div>
            <label><span>Topic</span><select name="topic" defaultValue={query.topic ?? "all"}><option value="all">All topics</option>{TOPIC_RULES.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
            <label><span>Cockpit task</span><select name="cockpit" defaultValue={query.cockpitTask ?? "all"}><option value="all">All tasks</option>{COCKPIT_RULES.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
            <label><span>Modality</span><select name="modality" defaultValue={query.modality ?? "all"}><option value="all">All modalities</option>{["Vision", "Video", "Audio", "Text", "Action"].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Year</span><select name="year" defaultValue={query.year ?? "all"}><option value="all">All years</option>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
            <label><span>Category</span><select name="category" defaultValue={query.category ?? "all"}><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Frontier ≥</span><select name="frontier" defaultValue={query.frontier ?? "all"}><option value="all">Any score</option>{[3,4,5].map((item) => <option value={item} key={item}>{item} / 5</option>)}</select></label>
            <label><span>Sort</span><select name="sort" defaultValue={query.sort}><option value="newest">Newest</option><option value="frontier">Frontier</option><option value="cockpit">Cockpit relevant</option><option value="engineering">Engineering ready</option></select></label>
            <button type="submit"><Filter size={14} /> Apply filters</button>
          </form>
          <div className="result-bar"><span>Showing {result.items.length} of {result.total.toLocaleString()}</span><span>Page {result.page} / {result.totalPages}</span></div>
          <PaperTable papers={result.items} showSummary />
          <Pagination page={result.page} totalPages={result.totalPages} searchParams={flatParams} />
        </div>
      </section>
    </>
  );
}
