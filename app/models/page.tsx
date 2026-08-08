import type { Metadata } from "next";
import { EntityDatabase } from "@/components/EntityDatabase";
import { PageHeader } from "@/components/PageHeader";
import { models } from "@/data/entities";
export const metadata: Metadata = { title: "Models", description: "Source-linked multimodal model profiles and cockpit suitability." };
export default function ModelsPage(){return <><PageHeader eyebrow="Knowledge entity database" title="Models" description="Architecture, modalities, weights, licenses, scale and deployment suitability—without filling unknown fields by guesswork." meta={<><span>{models.length} maintained profiles</span><span>Source-linked</span><span>Checkpoint terms take precedence</span></>} /><section className="section"><div className="container-wide"><EntityDatabase entities={models}/></div></section></>}
