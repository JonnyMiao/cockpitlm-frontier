import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { playbooks } from "@/data/playbooks";
export const metadata: Metadata = { title: "Engineering Playbooks", description: "Decision guides for multimodal cockpit research and deployment." };
export default function PlaybooksPage(){return <><PageHeader eyebrow="Engineering knowledge base" title="Engineering playbooks" description="Move from paper reading to data design, fine-tuning, fusion, distillation, training and deployment experiments." meta={<><span>{playbooks.length} maintained decision guides</span><span>Problem → decision tree → experiment</span></>} /><section className="section"><div className="container playbook-grid">{playbooks.map((playbook,index)=><Link href={`/playbooks/${playbook.slug}`} key={playbook.slug}><span className="mono-index">PB-{String(index+1).padStart(2,"0")}</span><BookOpenCheck size={19}/><h3>{playbook.title}</h3><p>{playbook.summary}</p><span className="text-link">Open playbook <ArrowRight size={13}/></span></Link>)}</div></section></>}
