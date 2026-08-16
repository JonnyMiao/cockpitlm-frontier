import type { Metadata } from "next";
import { EntityDatabase } from "@/components/EntityDatabase";
import { PageHeader } from "@/components/PageHeader";
import { benchmarks } from "@/data/entities";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: t(locale, "评测基准", "Benchmarks"), description: t(locale, "多模态与座舱评测基准的能力边界。", "Benchmark capability boundaries for multimodal and cockpit evaluation.") }; }

export default async function BenchmarksPage() {
  const locale = await getLocale();
  return <><PageHeader eyebrow={t(locale, "知识实体数据库", "Knowledge entity database")} title={t(locale, "评测基准", "Benchmarks")} description={t(locale, "在把排行榜当作工程证据之前，先理解每项评测能衡量什么、又不能证明什么。", "Understand what an evaluation measures—and what it cannot establish—before treating a leaderboard as engineering evidence.")} meta={<><span>{t(locale, `${benchmarks.length} 个能力档案`, `${benchmarks.length} capability profiles`)}</span><span>{t(locale, "不复制排行榜分数", "No copied leaderboard scores")}</span><span>{t(locale, "明确座舱适用边界", "Cockpit boundary noted")}</span></>} /><section className="section"><div className="container-wide"><EntityDatabase entities={benchmarks} locale={locale} /></div></section></>;
}
