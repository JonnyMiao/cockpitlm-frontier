import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { KnowledgeEntity } from "@/types/research";

export function EntityDatabase({ entities }: { entities: KnowledgeEntity[] }) {
  return (
    <div className="entity-database">
      {entities.map((entity) => <article className="entity-row" id={entity.id} key={entity.id}>
        <div className="entity-title"><span>{entity.kind}</span><h2>{entity.name}</h2><p>{entity.organization} · {entity.released}</p><Link href={entity.sourceUrl} target="_blank" rel="noreferrer">Official source <ArrowUpRight size={12} /></Link></div>
        <div className="entity-summary"><p>{entity.description}</p><div className="tag-row">{entity.modalities.map((item)=><span className="tag" key={item}>{item}</span>)}</div></div>
        <dl>{Object.entries(entity.attributes).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value || "Unavailable"}</dd></div>)}</dl>
        <div className="entity-cockpit"><span>Cockpit suitability</span><p>{entity.cockpitSuitability}</p><small>{entity.topics.join(" · ")}</small></div>
      </article>)}
    </div>
  );
}
