import type { Metadata } from "next";
import { EntityDatabase } from "@/components/EntityDatabase";
import { PageHeader } from "@/components/PageHeader";
import { datasets } from "@/data/entities";
export const metadata: Metadata = { title: "Datasets", description: "Multimodal, egocentric, driving and instruction datasets for cockpit research." };
export default function DatasetsPage(){return <><PageHeader eyebrow="Knowledge entity database" title="Datasets" description="Scale, modalities, temporal structure, multi-camera coverage, annotation, availability and fine-tuning suitability." meta={<><span>{datasets.length} maintained profiles</span><span>General + video + driving</span><span>License verification required</span></>} /><section className="section"><div className="container-wide"><EntityDatabase entities={datasets}/></div></section></>}
