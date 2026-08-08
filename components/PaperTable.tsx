import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import type { EnrichedPaper } from "@/types/research";
import { Score } from "./Score";

export function PaperTable({ papers, showSummary = false }: { papers: EnrichedPaper[]; showSummary?: boolean }) {
  if (!papers.length) return <div className="empty-state"><FileText size={22} /><strong>No papers match this view.</strong><span>Try removing one or more filters.</span></div>;
  return (
    <div className="paper-table-wrap">
      <table className="paper-table">
        <thead><tr><th>Paper</th><th>Area / Method</th><th>Published</th><th>Frontier</th><th>Cockpit</th><th>Ready</th></tr></thead>
        <tbody>
          {papers.map((paper) => (
            <tr key={paper.id}>
              <td className="paper-main">
                <Link href={`/papers/${encodeURIComponent(paper.id)}`}>{paper.title}</Link>
                <span>{paper.authors.slice(0, 3).join(", ")}{paper.authors.length > 3 ? " et al." : ""}</span>
                {showSummary && <p>{paper.intelligence.summary}</p>}
              </td>
              <td><div className="tag-row">{paper.topics.slice(0, 2).map((item) => <span className="tag" key={item.slug}>{item.name}</span>)}</div><small>{paper.techniques[0]?.name ?? paper.primaryCategory}</small></td>
              <td><time dateTime={paper.publishedAt}>{paper.publishedAt.slice(0, 10)}</time><small>{paper.journalRef ?? paper.primaryCategory}</small></td>
              <td><Score label="F" score={paper.intelligence.scores.frontier} compact /></td>
              <td><Score label="C" score={paper.intelligence.scores.cockpit} compact /></td>
              <td><Score label="E" score={paper.intelligence.scores.engineering} compact /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FeaturedPaper({ paper, index }: { paper: EnrichedPaper; index: number }) {
  return (
    <article className="featured-paper">
      <div className="featured-index">{String(index + 1).padStart(2, "0")}</div>
      <div className="featured-body">
        <div className="eyebrow-line"><span>{paper.topics[0]?.name ?? paper.primaryCategory}</span><time>{paper.publishedAt.slice(0, 10)}</time></div>
        <h3><Link href={`/papers/${encodeURIComponent(paper.id)}`}>{paper.title}</Link></h3>
        <p>{paper.intelligence.whyItMatters}</p>
        <div className="featured-transfer"><strong>Cockpit transfer</strong><span>{paper.intelligence.cockpitTransfer}</span></div>
      </div>
      <Link className="paper-arrow" href={`/papers/${encodeURIComponent(paper.id)}`} aria-label={`Read ${paper.title}`}><ArrowUpRight size={18} /></Link>
    </article>
  );
}
