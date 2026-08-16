import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Database, FileDown, Network, Users } from "lucide-react";
import { PaperTable } from "@/components/PaperTable";
import { Score } from "@/components/Score";
import { allPapers, getPaper } from "@/lib/repository";
import { cockpitGroup, cockpitName, cockpitRationale, getLocale, localizedPaperIntelligence, modalityName, t, techniqueName, topicName, trainingStageName } from "@/lib/i18n";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const locale = await getLocale();
  const paper = getPaper((await params).id);
  return paper ? { title: paper.title, description: localizedPaperIntelligence(locale, paper).summary } : { title: t(locale, "未找到论文", "Paper not found") };
}

export default async function PaperDetailPage({ params }: { params: Params }) {
  const locale = await getLocale();
  const paper = getPaper((await params).id);
  if (!paper) notFound();
  const intelligence = localizedPaperIntelligence(locale, paper);
  const related = allPapers().filter((candidate) => candidate.id !== paper.id && candidate.topics.some((topic) => paper.topics.some((current) => current.slug === topic.slug))).slice(0, 5);
  const architecture = [
    [t(locale, "视觉编码器", "Vision encoder"), paper.techniques.find((item) => item.slug === "vision-encoder")],
    [t(locale, "连接器", "Connector"), paper.techniques.find((item) => item.slug === "connector")],
    [t(locale, "融合模块", "Fusion"), paper.techniques.find((item) => ["cross-attention", "unified-transformer"].includes(item.slug))],
    [t(locale, "时序模块", "Temporal module"), paper.techniques.find((item) => item.slug === "temporal-modeling")],
    [t(locale, "语言模型", "Language model"), undefined],
  ];
  return (
    <>
      <article className="paper-detail">
        <header className="paper-hero container">
          <Link className="back-link" href="/papers"><ArrowLeft size={13} /> {t(locale, "返回论文列表", "Back to papers")}</Link>
          <div className="tag-row">{paper.topics.map((item) => <span className="tag tag-accent" key={item.slug}>{topicName(locale, item)}</span>)}<span className="tag">{paper.primaryCategory}</span></div>
          <h1>{paper.title}</h1>
          <p className="paper-authors">{paper.authors.join(", ")}</p>
          <div className="paper-meta-grid">
            <span><CalendarDays size={15} /> {t(locale, "发布日期", "Published")} <strong>{paper.publishedAt.slice(0, 10)}</strong></span>
            <span><Database size={15} /> {t(locale, "来源", "Source")} <strong>{paper.source.provider}</strong></span>
            <span><Network size={15} /> {t(locale, "记录", "Record")} <strong>{paper.source.recordId}</strong></span>
            <span><Users size={15} /> {t(locale, "作者", "Authors")} <strong>{paper.authors.length}</strong></span>
          </div>
          <div className="paper-actions"><Link href={paper.source.url} target="_blank" rel="noreferrer">{t(locale, "来源记录", "Source record")} <ArrowUpRight size={14} /></Link>{paper.source.pdfUrl && <Link href={paper.source.pdfUrl} target="_blank" rel="noreferrer"><FileDown size={14} /> PDF</Link>}</div>
        </header>

        <div className="container detail-layout">
          <div className="detail-content">
            <section className="detail-section read-first"><span className="section-number">01</span><div><h2>{t(locale, "为什么值得读？", "Why should I read this?")}</h2><p className="lead">{intelligence.whyItMatters}</p><div className="borrow-callout"><strong>{t(locale, "可以借鉴什么？", "What can we borrow?")}</strong><p>{intelligence.whatCanWeBorrow}</p></div></div></section>
            <section className="detail-section"><span className="section-number">02</span><div><h2>{t(locale, "研究问题", "Problem")}</h2><p>{intelligence.problem}</p><h3>{t(locale, "核心贡献", "Core contribution")}</h3><p>{intelligence.contribution}</p></div></section>
            <section className="detail-section"><span className="section-number">03</span><div><h2>{t(locale, "架构信号", "Architecture signals")}</h2><p className="source-caveat">{t(locale, "仅填写可从已索引来源元数据核验的组件；准确架构请阅读原论文。", "Only components verifiable from indexed source metadata are filled. Read the paper for exact architecture.")}</p><div className="architecture-flow">{architecture.map(([label, value], index) => <div key={label as string}><span>{label as string}</span><strong>{typeof value === "object" && value ? techniqueName(locale, value) : t(locale, "未报告", "Not reported")}</strong>{index < architecture.length - 1 && <i>→</i>}</div>)}</div></div></section>
            <section className="detail-section"><span className="section-number">04</span><div><h2>{t(locale, "训练与方法", "Training & methods")}</h2><dl className="fact-grid"><div><dt>{t(locale, "训练阶段", "Training stage")}</dt><dd>{paper.trainingStages.map((item) => trainingStageName(locale, item)).join(", ")}</dd></div><div><dt>{t(locale, "技术方法", "Techniques")}</dt><dd>{paper.techniques.map((item) => techniqueName(locale, item)).join(", ") || t(locale, "未报告", "Not reported")}</dd></div><div><dt>{t(locale, "模态", "Modalities")}</dt><dd>{paper.modalities.map((item) => modalityName(locale, item)).join(", ") || t(locale, "未知", "Unknown")}</dd></div><div><dt>{t(locale, "数据集", "Datasets")}</dt><dd>{t(locale, "尚未从来源元数据提取", "Not extracted from source metadata")}</dd></div></dl></div></section>
            <section className="detail-section"><span className="section-number">05</span><div><h2>{t(locale, "关键结果", "Key results")}</h2><p>{t(locale, "此处不复述未经核验的数字。CockpitLM 仅在对照论文或官方基准来源完成核验后展示定量结果。", "Not reproduced here. CockpitLM only displays quantitative results after they are verified against the paper or an official benchmark source.")}</p><div className="two-column-notes"><div><h3>{t(locale, "优势", "Strengths")}</h3><ul>{intelligence.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>{t(locale, "局限", "Limitations")}</h3><ul>{intelligence.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div></div></div></section>
            <section className="detail-section cockpit-transfer"><span className="section-number">06</span><div><h2>{t(locale, "座舱迁移", "Cockpit transfer")}</h2><p className="lead">{intelligence.cockpitTransfer}</p><div className="transfer-grid">{paper.cockpitTasks.length ? paper.cockpitTasks.map((task) => <div key={task.slug}><span>{cockpitGroup(locale, task)}</span><strong>{cockpitName(locale, task)}</strong><p>{cockpitRationale(locale, task)}</p></div>) : <div><span>{t(locale, "专家复核", "Expert review")}</span><strong>{t(locale, "未自动匹配任务", "No automatic task match")}</strong><p>{t(locale, "未命中关键词并不能证明该方法与座舱无关。", "Absence of a keyword match does not prove the method is irrelevant.")}</p></div>}</div><h3>{t(locale, "推荐实验", "Recommended experiment")}</h3><p>{intelligence.recommendedExperiment}</p></div></section>
          </div>
          <aside className="detail-aside">
            <div className="sticky-panel"><span className="eyebrow">{t(locale, "决策评分", "Decision scores")}</span><Score label={t(locale, "前沿度", "Frontier")} score={paper.intelligence.scores.frontier} locale={locale} /><Score label={t(locale, "座舱相关度", "Cockpit relevance")} score={paper.intelligence.scores.cockpit} locale={locale} /><Score label={t(locale, "工程成熟度", "Engineering readiness")} score={paper.intelligence.scores.engineering} locale={locale} /><p>{t(locale, "评分是从来源元数据推导的可解释启发式结果，不是基准测试成绩。", "Scores are explainable heuristics derived from source metadata—not benchmark results.")}</p></div>
            <div className="provenance-card"><h3>{t(locale, "来源追溯", "Provenance")}</h3><dl><div><dt>{t(locale, "提供方", "Provider")}</dt><dd>{paper.source.provider}</dd></div><div><dt>{t(locale, "采集时间", "Retrieved")}</dt><dd>{paper.source.retrievedAt.slice(0, 10)}</dd></div><div><dt>{t(locale, "更新时间", "Updated")}</dt><dd>{paper.updatedAt.slice(0, 10)}</dd></div><div><dt>DOI</dt><dd>{paper.doi ?? t(locale, "暂无", "Unavailable")}</dd></div><div><dt>{t(locale, "发表场所", "Venue")}</dt><dd>{paper.journalRef ?? t(locale, "未报告", "Not reported")}</dd></div></dl></div>
          </aside>
        </div>
      </article>
      <section className="section related-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">{t(locale, "研究邻域", "Research neighborhood")}</span><h2>{t(locale, "相关论文", "Related papers")}</h2></div></div><PaperTable papers={related} locale={locale} /></div></section>
    </>
  );
}
