import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { topicTrends } from "@/lib/repository";

export const metadata: Metadata = { title: "Research Radar", description: "90-day research momentum with sample-aware trend labels." };

export default function RadarPage() {
  const trends = topicTrends();
  const max = Math.max(1, ...trends.map((item) => item.recent));
  return (
    <>
      <PageHeader eyebrow="Technology radar" title="Research momentum without false precision" description="Compare the latest 90 days with the preceding 90 days. Labels are withheld when the sample is too small." meta={<><span>Window: latest corpus date − 180 days</span><span>Counts represent this indexed corpus</span><span>No citation-weighted claims</span></>} />
      <section className="section"><div className="container">
        <div className="radar-legend"><span><i className="emerging" /> Emerging</span><span><i className="rising" /> Rising</span><span><i className="active" /> Active</span><span><i className="mature" /> Mature</span><span><i className="insufficient" /> Insufficient sample</span></div>
        <div className="radar-table-wrap"><table className="radar-table"><thead><tr><th>Topic</th><th>Status</th><th>Recent 90d</th><th>Previous 90d</th><th>Momentum</th><th>Cockpit-high</th><th>Representative papers</th></tr></thead><tbody>{trends.map((trend) => <tr key={trend.slug}><td><Link href={`/topics/${trend.slug}`}>{trend.name} <ArrowUpRight size={12} /></Link></td><td><span className={`radar-status ${trend.status.toLowerCase().replace(" ", "-")}`}>{trend.status}</span></td><td><div className="count-bar"><i><b style={{width:`${trend.recent/max*100}%`}} /></i><strong>{trend.recent}</strong></div></td><td>{trend.previous}</td><td className={trend.growth !== null && trend.growth < 0 ? "negative" : "positive"}>{trend.growth === null ? "N/A" : `${trend.growth > 0 ? "+" : ""}${trend.growth}%`}</td><td>{trend.cockpit}</td><td><ul>{trend.papers.slice(0,2).map((paper) => <li key={paper.id}><Link href={`/papers/${encodeURIComponent(paper.id)}`}>{paper.title}</Link></li>)}</ul></td></tr>)}</tbody></table></div>
      </div></section>
    </>
  );
}
