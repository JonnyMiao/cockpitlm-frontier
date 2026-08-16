import type { Metadata } from "next";
import { Filter, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Pagination } from "@/components/Pagination";
import { PaperTable } from "@/components/PaperTable";
import { allPapers, listPapers } from "@/lib/repository";
import { COCKPIT_RULES, TOPIC_RULES } from "@/lib/taxonomy";
import { cockpitName, getLocale, modalityName, t, topicName } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: t(locale, "论文", "Papers"), description: t(locale, "搜索并筛选 CockpitLM Frontier 研究语料库。", "Search and filter the CockpitLM Frontier research corpus.") }; }

type SearchParams = Record<string, string | string[] | undefined>;
const value = (params: SearchParams, key: string) => typeof params[key] === "string" ? params[key] : undefined;

export default async function PapersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const locale = await getLocale();
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
      <PageHeader eyebrow={t(locale, "研究语料库", "Research corpus")} title={t(locale, "全部论文", "All papers")} description={t(locale, "来源可追溯的多模态研究，包含确定性分类、三项独立决策评分与座舱迁移分析。", "Source-traceable multimodal research with deterministic taxonomy, three independent decision scores and cockpit-transfer analysis.")} meta={<><span>{t(locale, `${result.total.toLocaleString()} 条匹配记录`, `${result.total.toLocaleString()} matching records`)}</span><span>{t(locale, "每页 25 篇 · 服务端筛选", "25 per page · server-side filtering")}</span><span>{t(locale, "最近来源采集：", "Latest source ingest: ")}{corpus[0]?.source.retrievedAt.slice(0, 10) ?? t(locale, "暂无", "Unavailable")}</span></>} />
      <section className="section papers-workspace">
        <div className="container-wide">
          <form className="filter-panel" action="/papers">
            <div className="filter-search"><Search size={15} /><input name="q" defaultValue={query.query} aria-label={t(locale, "论文关键词", "Paper keywords")} placeholder={t(locale, "标题、摘要、作者、方法…", "Title, abstract, author, method…")} /></div>
            <label><span>{t(locale, "研究主题", "Topic")}</span><select name="topic" defaultValue={query.topic ?? "all"}><option value="all">{t(locale, "全部主题", "All topics")}</option>{TOPIC_RULES.map((item) => <option value={item.slug} key={item.slug}>{topicName(locale, item)}</option>)}</select></label>
            <label><span>{t(locale, "座舱任务", "Cockpit task")}</span><select name="cockpit" defaultValue={query.cockpitTask ?? "all"}><option value="all">{t(locale, "全部任务", "All tasks")}</option>{COCKPIT_RULES.map((item) => <option value={item.slug} key={item.slug}>{cockpitName(locale, item as Parameters<typeof cockpitName>[1])}</option>)}</select></label>
            <label><span>{t(locale, "模态", "Modality")}</span><select name="modality" defaultValue={query.modality ?? "all"}><option value="all">{t(locale, "全部模态", "All modalities")}</option>{["Vision", "Video", "Audio", "Text", "Action"].map((item) => <option value={item} key={item}>{modalityName(locale, item)}</option>)}</select></label>
            <label><span>{t(locale, "年份", "Year")}</span><select name="year" defaultValue={query.year ?? "all"}><option value="all">{t(locale, "全部年份", "All years")}</option>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
            <label><span>{t(locale, "分类", "Category")}</span><select name="category" defaultValue={query.category ?? "all"}><option value="all">{t(locale, "全部分类", "All categories")}</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>{t(locale, "前沿度 ≥", "Frontier ≥")}</span><select name="frontier" defaultValue={query.frontier ?? "all"}><option value="all">{t(locale, "任意评分", "Any score")}</option>{[3,4,5].map((item) => <option value={item} key={item}>{item} / 5</option>)}</select></label>
            <label><span>{t(locale, "排序", "Sort")}</span><select name="sort" defaultValue={query.sort}><option value="newest">{t(locale, "最新发布", "Newest")}</option><option value="frontier">{t(locale, "前沿度", "Frontier")}</option><option value="cockpit">{t(locale, "座舱相关度", "Cockpit relevant")}</option><option value="engineering">{t(locale, "工程成熟度", "Engineering ready")}</option></select></label>
            <button type="submit"><Filter size={14} /> {t(locale, "应用筛选", "Apply filters")}</button>
          </form>
          <div className="result-bar"><span>{t(locale, `显示 ${result.items.length} / ${result.total.toLocaleString()} 条`, `Showing ${result.items.length} of ${result.total.toLocaleString()}`)}</span><span>{t(locale, `第 ${result.page} / ${result.totalPages} 页`, `Page ${result.page} / ${result.totalPages}`)}</span></div>
          <PaperTable papers={result.items} showSummary locale={locale} />
          <Pagination page={result.page} totalPages={result.totalPages} searchParams={flatParams} locale={locale} />
        </div>
      </section>
    </>
  );
}
