import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { topicTrends } from "@/lib/repository";
import { getLocale, t, topicName, trendStatus } from "@/lib/i18n";
import { paperHref } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: t(locale, "研究雷达", "Research Radar"), description: t(locale, "具备样本量意识的 90 天研究动量分析。", "90-day research momentum with sample-aware trend labels.") }; }

export default async function RadarPage() {
  const locale = await getLocale();
  const trends = topicTrends();
  const max = Math.max(1, ...trends.map((item) => item.recent));
  return (
    <>
      <PageHeader eyebrow={t(locale, "技术雷达", "Technology radar")} title={t(locale, "不制造虚假精度的研究动量", "Research momentum without false precision")} description={t(locale, "对比最近 90 天与此前 90 天；样本过少时不强行给出趋势标签。", "Compare the latest 90 days with the preceding 90 days. Labels are withheld when the sample is too small.")} meta={<><span>{t(locale, "窗口：语料库最新日期 − 180 天", "Window: latest corpus date − 180 days")}</span><span>{t(locale, "计数仅代表当前索引语料库", "Counts represent this indexed corpus")}</span><span>{t(locale, "不做引用加权结论", "No citation-weighted claims")}</span></>} />
      <section className="section"><div className="container">
        <div className="radar-legend">{[["emerging","Emerging"],["rising","Rising"],["active","Active"],["mature","Mature"],["insufficient","Insufficient sample"]].map(([className,status])=><span key={status}><i className={className} /> {trendStatus(locale, status)}</span>)}</div>
        <div className="radar-table-wrap"><table className="radar-table"><thead><tr><th>{t(locale, "主题", "Topic")}</th><th>{t(locale, "状态", "Status")}</th><th>{t(locale, "最近 90 天", "Recent 90d")}</th><th>{t(locale, "此前 90 天", "Previous 90d")}</th><th>{t(locale, "动量", "Momentum")}</th><th>{t(locale, "座舱高相关", "Cockpit-high")}</th><th>{t(locale, "代表论文", "Representative papers")}</th></tr></thead><tbody>{trends.map((trend) => <tr key={trend.slug}><td><a href={`/topics/${trend.slug}`}>{topicName(locale, trend)} <ArrowUpRight size={12} /></a></td><td><span className={`radar-status ${trend.status.toLowerCase().replace(" ", "-")}`}>{trendStatus(locale, trend.status)}</span></td><td><div className="count-bar"><i><b style={{width:`${trend.recent/max*100}%`}} /></i><strong>{trend.recent}</strong></div></td><td>{trend.previous}</td><td className={trend.growth !== null && trend.growth < 0 ? "negative" : "positive"}>{trend.growth === null ? "N/A" : `${trend.growth > 0 ? "+" : ""}${trend.growth}%`}</td><td>{trend.cockpit}</td><td><ul>{trend.papers.slice(0,2).map((paper) => <li key={paper.id}><a href={paperHref(paper.id)}>{paper.title}</a></li>)}</ul></td></tr>)}</tbody></table></div>
      </div></section>
    </>
  );
}
