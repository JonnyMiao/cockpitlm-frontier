import type { Metadata } from "next";
import { ArrowRight, CircleDotDashed } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { topicTrends } from "@/lib/repository";
import { TOPIC_RULES } from "@/lib/taxonomy";
import { getLocale, t, topicName, trendStatus } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: t(locale, "研究主题", "Research Topics"), description: t(locale, "面向多模态前沿研究的技术主题档案。", "Technical topic dossiers for frontier multimodal research.") }; }

export default async function TopicsPage() {
  const locale = await getLocale();
  const trends = topicTrends();
  return (
    <>
      <PageHeader eyebrow={t(locale, "知识结构", "Knowledge structure")} title={t(locale, "研究主题", "Research topics")} description={t(locale, "持续维护的技术档案连接架构、方法、代表论文、取舍与座舱启示。", "Living technical dossiers connect architectures, methods, representative papers, trade-offs and cockpit implications.")} meta={<><span>{t(locale, `${TOPIC_RULES.length} 个维护中的主题族`, `${TOPIC_RULES.length} maintained topic families`)}</span><span>{t(locale, "分类器：deterministic-v1", "Taxonomy classifier: deterministic-v1")}</span></>} />
      <section className="section"><div className="container topic-grid">
        {TOPIC_RULES.map((topic, index) => {
          const trend = trends.find((item) => item.slug === topic.slug);
          return <a href={`/topics/${topic.slug}`} key={topic.slug} className="topic-card"><div className="topic-card-top"><span className="mono-index">T-{String(index + 1).padStart(2, "0")}</span><CircleDotDashed size={18} /></div><h2>{topicName(locale, topic)}</h2><p>{topic.keywords.slice(0, 4).join(" · ")}</p><div className="topic-metrics"><span><strong>{trend?.recent ?? 0}</strong> {t(locale, "近期论文", "recent")}</span><span><strong>{trendStatus(locale, trend?.status ?? "Insufficient sample")}</strong> {t(locale, "状态", "status")}</span><span><strong>{trend?.cockpit ?? 0}</strong> {t(locale, "座舱高相关", "cockpit-high")}</span></div><span className="text-link">{t(locale, "打开档案", "Open dossier")} <ArrowRight size={13} /></span></a>;
        })}
      </div></section>
    </>
  );
}
