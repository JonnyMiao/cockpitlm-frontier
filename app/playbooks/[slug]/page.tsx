import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, GitBranch, TestTube2, TriangleAlert } from "lucide-react";
import { playbooks } from "@/data/playbooks";
import { localizePlaybook } from "@/data/playbooks.zh";
import { getLocale, t } from "@/lib/i18n";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;
  const source = playbooks.find((entry) => entry.slug === slug);
  return { title: source ? localizePlaybook(source, locale).title : t(locale, "工程手册", "Playbook") };
}

export default async function PlaybookPage({ params }: { params: Params }) {
  const locale = await getLocale();
  const { slug } = await params;
  const source = playbooks.find((item) => item.slug === slug);
  if (!source) notFound();
  const playbook = localizePlaybook(source, locale);
  return <article className="playbook-detail"><header className="playbook-hero container"><Link className="back-link" href="/playbooks"><ArrowLeft size={13}/> {t(locale,"全部手册","All playbooks")}</Link><span className="eyebrow">{t(locale,"工程手册","Engineering playbook")}</span><h1>{playbook.title}</h1><p>{playbook.summary}</p><div className="tag-row">{playbook.relatedTopics.map((topic)=><span className="tag tag-accent" key={topic}>{topic}</span>)}</div></header><div className="container playbook-layout"><aside><nav aria-label={t(locale,"手册目录","Playbook sections")}><a href="#problem">{t(locale,"问题","Problem")}</a><a href="#decision">{t(locale,"决策树","Decision tree")}</a><a href="#pipeline">{t(locale,"流程","Pipeline")}</a><a href="#tradeoffs">{t(locale,"取舍","Trade-offs")}</a><a href="#failures">{t(locale,"失败模式","Failure modes")}</a><a href="#experiments">{t(locale,"实验","Experiments")}</a></nav></aside><div><section id="problem"><span className="playbook-icon"><TriangleAlert size={17}/></span><h2>{t(locale,"问题","Problem")}</h2><p className="lead">{playbook.problem}</p></section><section id="decision"><span className="playbook-icon"><GitBranch size={17}/></span><h2>{t(locale,"决策树","Decision tree")}</h2><ol className="decision-tree">{playbook.decisionTree.map((item,index)=><li key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ol></section><section id="pipeline"><span className="playbook-icon"><Check size={17}/></span><h2>{t(locale,"推荐流程","Recommended pipeline")}</h2><div className="pipeline-track">{playbook.pipeline.map((item,index)=><div key={item}><span>{index+1}</span><strong>{item}</strong></div>)}</div></section><section id="tradeoffs"><h2>{t(locale,"技术取舍","Trade-offs")}</h2><div className="tradeoff-table"><div className="tradeoff-head"><span>{t(locale,"选择","Choice")}</span><span>{t(locale,"适用情况","Use when")}</span><span>{t(locale,"主要风险","Primary risk")}</span></div>{playbook.tradeoffs.map((item)=><div key={item.choice}><strong>{item.choice}</strong><p>{item.when}</p><p>{item.risk}</p></div>)}</div></section><section id="failures"><span className="playbook-icon"><TriangleAlert size={17}/></span><h2>{t(locale,"失败模式","Failure modes")}</h2><ul className="failure-list">{playbook.failureModes.map((item)=><li key={item}>{item}</li>)}</ul></section><section id="experiments"><span className="playbook-icon"><TestTube2 size={17}/></span><h2>{t(locale,"推荐实验","Recommended experiments")}</h2><ol className="experiment-list">{playbook.experiments.map((item,index)=><li key={item}><span>EXP-{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></li>)}</ol></section></div></div></article>;
}
