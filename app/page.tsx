import Link from "next/link";
import { ArrowRight, AudioLines, BrainCircuit, Gauge, Layers3, MonitorCog, Search, UsersRound } from "lucide-react";
import { FeaturedPaper, PaperTable } from "@/components/PaperTable";
import { getDashboardStats, listPapers, topicTrends } from "@/lib/repository";
import { playbooks } from "@/data/playbooks";
import { getLocale, t, topicName, trendStatus } from "@/lib/i18n";
import { localizePlaybook } from "@/data/playbooks.zh";

export default async function Home() {
  const locale = await getLocale();
  const cockpitLanes = [
    { icon: UsersRound, title: t(locale, "乘员状态", "Occupant State"), text: t(locale, "视线、疲劳、分心、情绪与姿态", "Gaze, fatigue, distraction, emotion and posture"), href: "/cockpit#driver-state" },
    { icon: BrainCircuit, title: t(locale, "行为与意图", "Behavior & Intent"), text: t(locale, "时序事件、意图、风险与未来动作", "Temporal events, intention, risk and future actions"), href: "/cockpit#behavior-event" },
    { icon: AudioLines, title: t(locale, "多模态交互", "Multimodal Interaction"), text: t(locale, "语音 + 视觉、指代对话与手势", "Voice + vision, grounded dialogue and gesture"), href: "/cockpit#interaction" },
    { icon: MonitorCog, title: t(locale, "智能体与 HMI", "Agent & HMI"), text: t(locale, "GUI 控制、工具调用、规划与安全执行", "GUI control, tool use, planning and safe execution"), href: "/cockpit#agent" },
    { icon: Gauge, title: t(locale, "端侧部署", "Edge Deployment"), text: t(locale, "流式推理、压缩、量化与时延", "Streaming, compression, quantization and latency"), href: "/cockpit#deployment" },
  ];
  const stats = getDashboardStats();
  const frontier = listPapers({ sort: "frontier", pageSize: 5 }).items;
  const latest = listPapers({ sort: "newest", pageSize: 8 }).items;
  const trends = topicTrends().slice(0, 7);
  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">{t(locale, "研究情报中枢 · 基于公开来源持续更新", "Research command center · Updated from public sources")}</span>
            <h1>{t(locale, "追踪多模态前沿研究，", "Frontier multimodal research,")}<br /><em>{t(locale, "转化为智能座舱决策。", "translated for the cockpit.")}</em></h1>
            <p>{t(locale, "持续追踪 VLM、OMNI、多模态智能体与世界模型，从论文与架构一路连接到座舱迁移、实验设计和端侧部署决策。", "Track VLM, OMNI, multimodal agents and world models—from paper and architecture to cockpit transfer, experiments and edge-deployment decisions.")}</p>
            <form className="hero-search" action="/papers">
              <Search size={18} aria-hidden="true" />
              <input name="q" aria-label={t(locale, "搜索研究语料库", "Search the research corpus")} placeholder={t(locale, "搜索论文、模型、方法、数据集、基准…", "Search papers, models, methods, datasets, benchmarks…")} />
              <button type="submit">{t(locale, "搜索语料库", "Search corpus")}</button>
            </form>
          </div>
          <div className="knowledge-chain" aria-label={t(locale, "研究知识链", "Research knowledge chain")}>
            <span>{t(locale, "论文", "Paper")}</span><i /> <span>{t(locale, "方法", "Method")}</span><i /> <span>{t(locale, "模型", "Model")}</span><i /> <span>{t(locale, "基准", "Benchmark")}</span><i /> <strong>{t(locale, "座舱迁移", "Cockpit transfer")}</strong><i /> <strong>{t(locale, "工程决策", "Engineering decision")}</strong>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          <div><span>{t(locale, "已索引论文", "Indexed papers")}</span><strong>{stats.total.toLocaleString()}</strong><small>{t(locale, "真实 arXiv 记录", "real arXiv records")}</small></div>
          <div><span>{t(locale, "本周新增", "New this week")}</span><strong>{stats.newThisWeek}</strong><small>{t(locale, "相对最新采集批次", "relative to latest ingest")}</small></div>
          <div><span>{t(locale, "前沿精选", "Frontier shortlist")}</span><strong>{stats.mustRead}</strong><small>{t(locale, "启发式评分 ≥ 4", "heuristic score ≥ 4")}</small></div>
          <div><span>{t(locale, "座舱高相关", "Cockpit relevant")}</span><strong>{stats.cockpitRelevant}</strong><small>{t(locale, "迁移评分 ≥ 4", "transfer score ≥ 4")}</small></div>
          <div><span>{t(locale, "模型档案", "Model profiles")}</span><strong>{stats.newModels}</strong><small>{t(locale, "来源可追溯条目", "source-linked entries")}</small></div>
        </div>
      </section>

      <section className="section">
        <div className="container command-grid">
          <div className="frontier-column">
            <div className="section-heading"><div><span className="eyebrow">{t(locale, "编辑视角", "Editorial lens")}</span><h2>{t(locale, "本周前沿", "Frontier this week")}</h2><p>{t(locale, "近期方法信号或迁移价值较强的研究。", "Recent work with strong methodological or transfer signals.")}</p></div><Link href="/papers?sort=frontier">{t(locale, "查看排行", "View ranking")} <ArrowRight size={13} /></Link></div>
            {frontier.map((paper, index) => <FeaturedPaper key={paper.id} paper={paper} index={index} locale={locale} />)}
          </div>
          <aside className="radar-panel">
            <div className="panel-heading"><span className="eyebrow">{t(locale, "90 天信号", "90-day signal")}</span><h2>{t(locale, "研究雷达", "Research radar")}</h2><Link href="/radar">{t(locale, "打开完整雷达", "Open full radar")}</Link></div>
            <div className="radar-list">
              {trends.map((trend, index) => (
                <a href={`/topics/${trend.slug}`} key={trend.slug}>
                  <span className="radar-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="radar-topic"><strong>{topicName(locale, trend)}</strong><small>{trendStatus(locale, trend.status)} · {t(locale, `近 90 天 ${trend.recent} 篇`, `${trend.recent} recent papers`)}</small></span>
                  <span className={`trend-change ${trend.growth !== null && trend.growth < 0 ? "negative" : ""}`}>{trend.growth === null ? "N/A" : `${trend.growth > 0 ? "+" : ""}${trend.growth}%`}</span>
                </a>
              ))}
            </div>
            <p className="panel-note">{t(locale, "当 180 天样本不足时，平台不会强行给出趋势结论。", "Trend labels are withheld when the 180-day sample is insufficient.")}</p>
          </aside>
        </div>
      </section>

      <section className="section cockpit-section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">{t(locale, "迁移分类体系", "Transfer taxonomy")}</span><h2>{t(locale, "面向智能座舱", "For intelligent cockpits")}</h2><p>{t(locale, "从需要解决的工程任务进入研究知识图谱。", "Enter the research graph through the engineering task you need to solve.")}</p></div><Link href="/cockpit">{t(locale, "探索技术地图", "Explore technical map")} <ArrowRight size={13} /></Link></div>
          <div className="cockpit-lanes">
            {cockpitLanes.map((lane) => <Link href={lane.href} key={lane.title}><lane.icon size={20} /><strong>{lane.title}</strong><span>{lane.text}</span><ArrowRight size={14} /></Link>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">{t(locale, "从阅读到行动", "From reading to action")}</span><h2>{t(locale, "工程手册", "Engineering playbooks")}</h2><p>{t(locale, "覆盖数据、适配、融合与部署的决策框架。", "Decision frameworks for data, adaptation, fusion and deployment.")}</p></div><Link href="/playbooks">{t(locale, "全部手册", "All playbooks")} <ArrowRight size={13} /></Link></div>
          <div className="playbook-grid home-playbooks">
            {playbooks.slice(0, 4).map((source, index) => { const playbook = localizePlaybook(source, locale); return <a href={`/playbooks/${playbook.slug}`} key={playbook.slug}><span className="mono-index">PB-{String(index + 1).padStart(2, "0")}</span><Layers3 size={19} /><h3>{playbook.title}</h3><p>{playbook.summary}</p><span className="text-link">{t(locale, "打开决策指南", "Open decision guide")} <ArrowRight size={13} /></span></a>; })}
          </div>
        </div>
      </section>

      <section className="section latest-section">
        <div className="container-wide">
          <div className="section-heading"><div><span className="eyebrow">{t(locale, "增量采集", "Incremental ingest")}</span><h2>{t(locale, "最新论文", "Latest papers")}</h2><p>{t(locale, "来源记录经过标准化与去重；论文库每页展示 25 篇。", "Normalized and deduplicated source records; 25 papers per server-rendered page.")}</p></div><Link href="/papers">{t(locale, "打开全部论文", "Open all papers")} <ArrowRight size={13} /></Link></div>
          <PaperTable papers={latest} locale={locale} />
        </div>
      </section>
    </>
  );
}
