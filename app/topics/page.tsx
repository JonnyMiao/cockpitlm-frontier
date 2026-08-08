import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDotDashed } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { topicTrends } from "@/lib/repository";
import { TOPIC_RULES } from "@/lib/taxonomy";

export const metadata: Metadata = { title: "Research Topics", description: "Technical topic dossiers for frontier multimodal research." };

export default function TopicsPage() {
  const trends = topicTrends();
  return (
    <>
      <PageHeader eyebrow="Knowledge structure" title="Research topics" description="Living technical dossiers connect architectures, methods, representative papers, trade-offs and cockpit implications." meta={<><span>{TOPIC_RULES.length} maintained topic families</span><span>Taxonomy classifier: deterministic-v1</span></>} />
      <section className="section"><div className="container topic-grid">
        {TOPIC_RULES.map((topic, index) => {
          const trend = trends.find((item) => item.slug === topic.slug);
          return <Link href={`/topics/${topic.slug}`} key={topic.slug} className="topic-card"><div className="topic-card-top"><span className="mono-index">T-{String(index + 1).padStart(2, "0")}</span><CircleDotDashed size={18} /></div><h2>{topic.name}</h2><p>{topic.keywords.slice(0, 4).join(" · ")}</p><div className="topic-metrics"><span><strong>{trend?.recent ?? 0}</strong> recent</span><span><strong>{trend?.status ?? "Insufficient sample"}</strong> status</span><span><strong>{trend?.cockpit ?? 0}</strong> cockpit-high</span></div><span className="text-link">Open dossier <ArrowRight size={13} /></span></Link>;
        })}
      </div></section>
    </>
  );
}
