import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { KnowledgeEntity } from "@/types/research";
import type { Locale } from "@/lib/i18n";
import { attributeName, entityKind, modalityName, t } from "@/lib/i18n";
import { localizeEntity } from "@/data/entities.zh";

export function EntityDatabase({ entities, locale }: { entities: KnowledgeEntity[]; locale: Locale }) {
  return (
    <div className="entity-database">
      {entities.map((source) => { const entity = localizeEntity(source, locale); return <article className="entity-row" id={entity.id} key={entity.id}>
        <div className="entity-title"><span>{entityKind(locale, entity.kind)}</span><h2>{entity.name}</h2><p>{entity.organization} · {entity.released}</p><Link href={entity.sourceUrl} target="_blank" rel="noreferrer">{t(locale, "官方来源", "Official source")} <ArrowUpRight size={12} /></Link></div>
        <div className="entity-summary"><p>{entity.description}</p><div className="tag-row">{entity.modalities.map((item)=><span className="tag" key={item}>{modalityName(locale, item)}</span>)}</div></div>
        <dl>{Object.entries(entity.attributes).map(([key,value])=><div key={key}><dt>{attributeName(locale, key)}</dt><dd>{value || t(locale, "暂无", "Unavailable")}</dd></div>)}</dl>
        <div className="entity-cockpit"><span>{t(locale, "座舱适用性", "Cockpit suitability")}</span><p>{entity.cockpitSuitability}</p><small>{entity.topics.join(" · ")}</small></div>
      </article>; })}
    </div>
  );
}
