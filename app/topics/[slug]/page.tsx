import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PaperTable } from "@/components/PaperTable";
import { allPapers, listPapers, topicTrends } from "@/lib/repository";
import { TOPIC_RULES } from "@/lib/taxonomy";

type Params = Promise<{ slug: string }>;
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> { const { slug } = await params; const topic = TOPIC_RULES.find((item) => item.slug === slug); return { title: topic?.name ?? "Topic" }; }

export default async function TopicPage({ params }: { params: Params }) {
  const slug = (await params).slug;
  const topic = TOPIC_RULES.find((item) => item.slug === slug);
  if (!topic) notFound();
  const trend = topicTrends().find((item) => item.slug === slug);
  const papers = listPapers({ topic: slug, sort: "frontier", pageSize: 25 }).items;
  const techniqueCounts = new Map<string, number>();
  for (const paper of allPapers().filter((item) => item.topics.some((entry) => entry.slug === slug))) for (const technique of paper.techniques) techniqueCounts.set(technique.name, (techniqueCounts.get(technique.name) ?? 0) + 1);
  const families = [...techniqueCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  return (
    <>
      <header className="topic-hero container"><Link className="back-link" href="/topics"><ArrowLeft size={13} /> All topics</Link><span className="eyebrow">Technical dossier</span><h1>{topic.name}</h1><p>Current-state view built from source records classified by: {topic.keywords.join(", ")}.</p><div className="topic-scoreline"><div><span>Recent 90d</span><strong>{trend?.recent ?? 0}</strong></div><div><span>Previous 90d</span><strong>{trend?.previous ?? 0}</strong></div><div><span>Momentum</span><strong>{trend?.growth === null || trend?.growth === undefined ? "N/A" : `${trend.growth > 0 ? "+" : ""}${trend.growth}%`}</strong></div><div><span>Maturity</span><strong>{trend?.status ?? "Insufficient sample"}</strong></div></div></header>
      <section className="section"><div className="container dossier-grid"><div className="dossier-main"><section><span className="eyebrow">Overview</span><h2>Current state</h2><p>{trend?.status === "Insufficient sample" ? "The current corpus does not contain enough observations for a robust momentum label. The paper view remains available without forcing a trend conclusion." : `${topic.name} is classified as ${trend?.status.toLowerCase()} in the current 180-day comparison window. Trend counts reflect papers in this corpus, not the full field.`}</p></section><section><span className="eyebrow">Architecture space</span><h2>Technical families</h2><div className="family-bars">{families.length ? families.map(([name, count]) => <div key={name}><span>{name}</span><i><b style={{ width: `${Math.min(100, count / Math.max(1, families[0][1]) * 100)}%` }} /></i><strong>{count}</strong></div>) : <p>No method family has enough classified evidence.</p>}</div></section><section><span className="eyebrow">Engineering view</span><h2>Trade-offs & open problems</h2><div className="insight-columns"><div><h3>What to compare</h3><ul><li>Accuracy at a fixed visual-token budget</li><li>Latency and memory under the target hardware path</li><li>Robustness to missing or degraded modalities</li><li>Domain shift across occupants, cabins and scenarios</li></ul></div><div><h3>Open questions</h3><ul><li>Which gains survive controlled data and model-scale comparisons?</li><li>What is the smallest trainable surface for cockpit transfer?</li><li>How should temporal and safety failures be measured?</li><li>Can the method support streaming and bounded memory?</li></ul></div></div></section><section><span className="eyebrow">Cockpit implications</span><h2>Recommended experiment</h2><p>Choose the highest-scoring paper below, reproduce its smallest verifiable component, then run a leakage-controlled cockpit transfer study with fixed latency and memory budgets.</p><Link className="text-link" href={`/papers?topic=${slug}&sort=cockpit`}>Rank by cockpit relevance <ArrowRight size={13} /></Link></section></div><aside className="dossier-aside"><h3>Reading strategy</h3><ol><li>Start with a recent high-frontier paper.</li><li>Read one established baseline.</li><li>Compare training data and token budget.</li><li>Verify reported artifacts at source.</li><li>Design a narrow cockpit ablation.</li></ol><p>Topic assignment is explainable keyword evidence, not a claim by the original authors.</p></aside></div></section>
      <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Recommended reading</span><h2>Representative papers</h2></div><Link href={`/papers?topic=${slug}`}>View all <ArrowRight size={13} /></Link></div><PaperTable papers={papers.slice(0, 12)} showSummary /></div></section>
    </>
  );
}
