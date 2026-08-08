import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Database, FileDown, Network, Users } from "lucide-react";
import { PaperTable } from "@/components/PaperTable";
import { Score } from "@/components/Score";
import { allPapers, getPaper } from "@/lib/repository";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const paper = getPaper((await params).id);
  return paper ? { title: paper.title, description: paper.intelligence.summary } : { title: "Paper not found" };
}

export default async function PaperDetailPage({ params }: { params: Params }) {
  const paper = getPaper((await params).id);
  if (!paper) notFound();
  const related = allPapers().filter((candidate) => candidate.id !== paper.id && candidate.topics.some((topic) => paper.topics.some((current) => current.slug === topic.slug))).slice(0, 5);
  const architecture = [
    ["Vision encoder", paper.techniques.find((item) => item.slug === "vision-encoder")?.name ?? "Not reported"],
    ["Connector", paper.techniques.find((item) => item.slug === "connector")?.name ?? "Not reported"],
    ["Fusion", paper.techniques.find((item) => ["cross-attention", "unified-transformer"].includes(item.slug))?.name ?? "Not reported"],
    ["Temporal module", paper.techniques.find((item) => item.slug === "temporal-modeling")?.name ?? "Not reported"],
    ["Language model", "Not reported in indexed metadata"],
  ];
  return (
    <>
      <article className="paper-detail">
        <header className="paper-hero container">
          <Link className="back-link" href="/papers"><ArrowLeft size={13} /> Back to papers</Link>
          <div className="tag-row">{paper.topics.map((item) => <span className="tag tag-accent" key={item.slug}>{item.name}</span>)}<span className="tag">{paper.primaryCategory}</span></div>
          <h1>{paper.title}</h1>
          <p className="paper-authors">{paper.authors.join(", ")}</p>
          <div className="paper-meta-grid">
            <span><CalendarDays size={15} /> Published <strong>{paper.publishedAt.slice(0, 10)}</strong></span>
            <span><Database size={15} /> Source <strong>{paper.source.provider}</strong></span>
            <span><Network size={15} /> Record <strong>{paper.source.recordId}</strong></span>
            <span><Users size={15} /> Authors <strong>{paper.authors.length}</strong></span>
          </div>
          <div className="paper-actions"><Link href={paper.source.url} target="_blank" rel="noreferrer">Source record <ArrowUpRight size={14} /></Link>{paper.source.pdfUrl && <Link href={paper.source.pdfUrl} target="_blank" rel="noreferrer"><FileDown size={14} /> PDF</Link>}</div>
        </header>

        <div className="container detail-layout">
          <div className="detail-content">
            <section className="detail-section read-first"><span className="section-number">01</span><div><h2>Why should I read this?</h2><p className="lead">{paper.intelligence.whyItMatters}</p><div className="borrow-callout"><strong>What can we borrow?</strong><p>{paper.intelligence.whatCanWeBorrow}</p></div></div></section>
            <section className="detail-section"><span className="section-number">02</span><div><h2>Problem</h2><p>{paper.intelligence.problem}</p><h3>Core contribution</h3><p>{paper.intelligence.contribution}</p></div></section>
            <section className="detail-section"><span className="section-number">03</span><div><h2>Architecture signals</h2><p className="source-caveat">Only components verifiable from indexed source metadata are filled. Read the paper for exact architecture.</p><div className="architecture-flow">{architecture.map(([label, value], index) => <div key={label}><span>{label}</span><strong>{value}</strong>{index < architecture.length - 1 && <i>→</i>}</div>)}</div></div></section>
            <section className="detail-section"><span className="section-number">04</span><div><h2>Training & methods</h2><dl className="fact-grid"><div><dt>Training stage</dt><dd>{paper.trainingStages.join(", ")}</dd></div><div><dt>Techniques</dt><dd>{paper.techniques.map((item) => item.name).join(", ") || "Not reported"}</dd></div><div><dt>Modalities</dt><dd>{paper.modalities.join(", ") || "Unknown"}</dd></div><div><dt>Datasets</dt><dd>Not extracted from source metadata</dd></div></dl></div></section>
            <section className="detail-section"><span className="section-number">05</span><div><h2>Key results</h2><p>Not reproduced here. CockpitLM only displays quantitative results after they are verified against the paper or an official benchmark source.</p><div className="two-column-notes"><div><h3>Strengths</h3><ul>{paper.intelligence.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Limitations</h3><ul>{paper.intelligence.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div></div></div></section>
            <section className="detail-section cockpit-transfer"><span className="section-number">06</span><div><h2>Cockpit transfer</h2><p className="lead">{paper.intelligence.cockpitTransfer}</p><div className="transfer-grid">{paper.cockpitTasks.length ? paper.cockpitTasks.map((task) => <div key={task.slug}><span>{task.group}</span><strong>{task.name}</strong><p>{task.rationale}</p></div>) : <div><span>Expert review</span><strong>No automatic task match</strong><p>Absence of a keyword match does not prove the method is irrelevant.</p></div>}</div><h3>Recommended experiment</h3><p>{paper.intelligence.recommendedExperiment}</p></div></section>
          </div>
          <aside className="detail-aside">
            <div className="sticky-panel"><span className="eyebrow">Decision scores</span><Score label="Frontier" score={paper.intelligence.scores.frontier} /><Score label="Cockpit relevance" score={paper.intelligence.scores.cockpit} /><Score label="Engineering readiness" score={paper.intelligence.scores.engineering} /><p>Scores are explainable heuristics derived from source metadata—not benchmark results.</p></div>
            <div className="provenance-card"><h3>Provenance</h3><dl><div><dt>Provider</dt><dd>{paper.source.provider}</dd></div><div><dt>Retrieved</dt><dd>{paper.source.retrievedAt.slice(0, 10)}</dd></div><div><dt>Updated</dt><dd>{paper.updatedAt.slice(0, 10)}</dd></div><div><dt>DOI</dt><dd>{paper.doi ?? "Unavailable"}</dd></div><div><dt>Venue</dt><dd>{paper.journalRef ?? "Not reported"}</dd></div></dl></div>
          </aside>
        </div>
      </article>
      <section className="section related-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Research neighborhood</span><h2>Related papers</h2></div></div><PaperTable papers={related} /></div></section>
    </>
  );
}
