import { ArrowUpRight, FileText } from "lucide-react";
import type { EnrichedPaper } from "@/types/research";
import { Score } from "./Score";
import type { Locale } from "@/lib/i18n";
import { localizedPaperIntelligence, techniqueName, t, topicName } from "@/lib/i18n";
import { paperHref } from "@/lib/routes";

export function PaperTable({ papers, showSummary = false, locale }: { papers: EnrichedPaper[]; showSummary?: boolean; locale: Locale }) {
  if (!papers.length) return <div className="empty-state"><FileText size={22} /><strong>{t(locale, "当前条件下没有论文。", "No papers match this view.")}</strong><span>{t(locale, "请尝试移除一个或多个筛选条件。", "Try removing one or more filters.")}</span></div>;
  return (
    <div className="paper-table-wrap">
      <table className="paper-table">
        <thead><tr><th>{t(locale, "论文", "Paper")}</th><th>{t(locale, "领域 / 方法", "Area / Method")}</th><th>{t(locale, "发布日期", "Published")}</th><th>{t(locale, "前沿度", "Frontier")}</th><th>{t(locale, "座舱相关", "Cockpit")}</th><th>{t(locale, "工程度", "Ready")}</th></tr></thead>
        <tbody>
          {papers.map((paper) => (
            <tr key={paper.id}>
              <td className="paper-main">
                <a href={paperHref(paper.id)}>{paper.title}</a>
                <span>{paper.authors.slice(0, 3).join(", ")}{paper.authors.length > 3 ? " et al." : ""}</span>
                {showSummary && <p>{localizedPaperIntelligence(locale, paper).summary}</p>}
              </td>
              <td><div className="tag-row">{paper.topics.slice(0, 2).map((item) => <span className="tag" key={item.slug}>{topicName(locale, item)}</span>)}</div><small>{paper.techniques[0] ? techniqueName(locale, paper.techniques[0]) : paper.primaryCategory}</small></td>
              <td><time dateTime={paper.publishedAt}>{paper.publishedAt.slice(0, 10)}</time><small>{paper.journalRef ?? paper.primaryCategory}</small></td>
              <td><Score label="F" score={paper.intelligence.scores.frontier} compact locale={locale} /></td>
              <td><Score label="C" score={paper.intelligence.scores.cockpit} compact locale={locale} /></td>
              <td><Score label="E" score={paper.intelligence.scores.engineering} compact locale={locale} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FeaturedPaper({ paper, index, locale }: { paper: EnrichedPaper; index: number; locale: Locale }) {
  const intelligence = localizedPaperIntelligence(locale, paper);
  return (
    <article className="featured-paper">
      <div className="featured-index">{String(index + 1).padStart(2, "0")}</div>
      <div className="featured-body">
        <div className="eyebrow-line"><span>{paper.topics[0] ? topicName(locale, paper.topics[0]) : paper.primaryCategory}</span><time>{paper.publishedAt.slice(0, 10)}</time></div>
        <h3><a href={paperHref(paper.id)}>{paper.title}</a></h3>
        <p>{intelligence.whyItMatters}</p>
        <div className="featured-transfer"><strong>{t(locale, "座舱迁移", "Cockpit transfer")}</strong><span>{intelligence.cockpitTransfer}</span></div>
      </div>
      <a className="paper-arrow" href={paperHref(paper.id)} aria-label={t(locale, `阅读 ${paper.title}`, `Read ${paper.title}`)}><ArrowUpRight size={18} /></a>
    </article>
  );
}
