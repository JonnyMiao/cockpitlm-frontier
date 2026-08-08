import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { playbooks } from "@/data/playbooks";
import { localizePlaybook } from "@/data/playbooks.zh";
import { getLocale, t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { const locale = await getLocale(); return { title: t(locale, "工程手册", "Engineering Playbooks"), description: t(locale, "面向多模态座舱研究与部署的工程决策指南。", "Decision guides for multimodal cockpit research and deployment.") }; }

export default async function PlaybooksPage() {
  const locale = await getLocale();
  return <><PageHeader eyebrow={t(locale, "工程知识库", "Engineering knowledge base")} title={t(locale, "工程手册", "Engineering playbooks")} description={t(locale, "把论文阅读连接到数据设计、微调、融合、蒸馏、训练与部署实验。", "Move from paper reading to data design, fine-tuning, fusion, distillation, training and deployment experiments.")} meta={<><span>{t(locale, `${playbooks.length} 份维护中的决策指南`, `${playbooks.length} maintained decision guides`)}</span><span>{t(locale, "问题 → 决策树 → 实验", "Problem → decision tree → experiment")}</span></>} /><section className="section"><div className="container playbook-grid">{playbooks.map((source,index)=>{const playbook=localizePlaybook(source,locale);return <a href={`/playbooks/${playbook.slug}`} key={playbook.slug}><span className="mono-index">PB-{String(index+1).padStart(2,"0")}</span><BookOpenCheck size={19}/><h3>{playbook.title}</h3><p>{playbook.summary}</p><span className="text-link">{t(locale,"打开手册","Open playbook")} <ArrowRight size={13}/></span></a>;})}</div></section></>;
}
