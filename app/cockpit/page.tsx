import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { COCKPIT_RULES } from "@/lib/taxonomy";

export const metadata: Metadata = { title: "Cockpit Intelligence", description: "Cockpit task taxonomy and technical map for multimodal research transfer." };

const stages = [
  ["01", "Sensing", "Camera · microphone · CAN · radar · HMI"], ["02", "Representation", "Vision · audio · state encoders"], ["03", "Fusion", "Cross-attention · tokens · query modules"],
  ["04", "Understanding", "Objects · occupants · behavior · events"], ["05", "Reasoning", "Intent · risk · future actions"], ["06", "Interaction", "Voice · vision · gesture · dialogue"],
  ["07", "Agent", "Planning · tool use · GUI grounding"], ["08", "Execution", "Vehicle functions · safety validation"], ["09", "Edge", "Streaming · compression · deployment"],
];

export default function CockpitPage() {
  const groups = [...new Set(COCKPIT_RULES.map((task) => task.group))];
  return (
    <>
      <PageHeader eyebrow="Cockpit intelligence" title="Translate general multimodal research into vehicle decisions" description="A task-first taxonomy and technical map for cabin perception, occupant understanding, interaction, agents and edge deployment." meta={<><span>Multi-camera is first-class</span><span>Non-visual signals keep their structure</span><span>Safety validation stays outside model confidence</span></>} />
      <section className="section technical-map"><div className="container-wide"><div className="section-heading"><div><span className="eyebrow">End-to-end map</span><h2>Cockpit technical map</h2><p>Methods, papers, models and datasets can attach to every stage.</p></div></div><div className="map-track">{stages.map(([number,title,text],index)=><div key={title}><span>{number}</span><strong>{title}</strong><small>{text}</small>{index<stages.length-1&&<i>→</i>}</div>)}</div></div></section>
      <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Task graph</span><h2>Cockpit taxonomy</h2><p>A paper can map to multiple tasks with explicit evidence and rationale.</p></div></div><div className="taxonomy-groups">{groups.map((group) => <section id={group?.toLowerCase().split(" /")[0].replaceAll(" ", "-")} key={group}><h3>{group}</h3><div>{COCKPIT_RULES.filter((task)=>task.group===group).map((task)=><Link href={`/papers?cockpit=${task.slug}&sort=cockpit`} key={task.slug}><strong>{task.name}</strong><p>{task.rationale}</p><span>Browse mapped papers <ArrowRight size={12} /></span></Link>)}</div></section>)}</div></div></section>
      <section className="section signal-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Fusion principles</span><h2>Heterogeneous signals are not just text</h2></div></div><div className="signal-grid">{["Multi-camera","Microphone array","Speech","Vehicle state","CAN","HMI state","Gaze","Gesture","Seat state","Radar","User history","Navigation context"].map((signal)=><span key={signal}>{signal}</span>)}</div><div className="principle-note"><strong>Design principle</strong><p>Serialize sparse human-readable state when useful, but preserve continuous timing, uncertainty and geometry through dedicated encoders or structured tokens when the task depends on them.</p></div></div></section>
    </>
  );
}
