import Link from "next/link";
import { ArrowRight, AudioLines, BrainCircuit, Gauge, Layers3, MonitorCog, Search, UsersRound } from "lucide-react";
import { FeaturedPaper, PaperTable } from "@/components/PaperTable";
import { getDashboardStats, listPapers, topicTrends } from "@/lib/repository";
import { playbooks } from "@/data/playbooks";

const cockpitLanes = [
  { icon: UsersRound, title: "Occupant State", text: "Gaze, fatigue, distraction, emotion and posture", href: "/cockpit#driver-state" },
  { icon: BrainCircuit, title: "Behavior & Intent", text: "Temporal events, intention, risk and future actions", href: "/cockpit#behavior-event" },
  { icon: AudioLines, title: "Multimodal Interaction", text: "Voice + vision, grounded dialogue and gesture", href: "/cockpit#interaction" },
  { icon: MonitorCog, title: "Agent & HMI", text: "GUI control, tool use, planning and safe execution", href: "/cockpit#agent" },
  { icon: Gauge, title: "Edge Deployment", text: "Streaming, compression, quantization and latency", href: "/cockpit#deployment" },
];

export default function Home() {
  const stats = getDashboardStats();
  const frontier = listPapers({ sort: "frontier", pageSize: 5 }).items;
  const latest = listPapers({ sort: "newest", pageSize: 8 }).items;
  const trends = topicTrends().slice(0, 7);
  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Research command center · Updated from public sources</span>
            <h1>Frontier multimodal research,<br /><em>translated for the cockpit.</em></h1>
            <p>Track VLM, OMNI, multimodal agents and world models—from paper and architecture to cockpit transfer, experiments and edge-deployment decisions.</p>
            <form className="hero-search" action="/papers">
              <Search size={18} aria-hidden="true" />
              <input name="q" aria-label="Search the research corpus" placeholder="Search papers, models, methods, datasets, benchmarks…" />
              <button type="submit">Search corpus</button>
            </form>
          </div>
          <div className="knowledge-chain" aria-label="Research knowledge chain">
            <span>Paper</span><i /> <span>Method</span><i /> <span>Model</span><i /> <span>Benchmark</span><i /> <strong>Cockpit transfer</strong><i /> <strong>Engineering decision</strong>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          <div><span>Indexed papers</span><strong>{stats.total.toLocaleString()}</strong><small>real arXiv records</small></div>
          <div><span>New this week</span><strong>{stats.newThisWeek}</strong><small>relative to latest ingest</small></div>
          <div><span>Frontier shortlist</span><strong>{stats.mustRead}</strong><small>heuristic score ≥ 4</small></div>
          <div><span>Cockpit relevant</span><strong>{stats.cockpitRelevant}</strong><small>transfer score ≥ 4</small></div>
          <div><span>Model profiles</span><strong>{stats.newModels}</strong><small>source-linked entries</small></div>
        </div>
      </section>

      <section className="section">
        <div className="container command-grid">
          <div className="frontier-column">
            <div className="section-heading"><div><span className="eyebrow">Editorial lens</span><h2>Frontier this week</h2><p>Recent work with strong methodological or transfer signals.</p></div><Link href="/papers?sort=frontier">View ranking <ArrowRight size={13} /></Link></div>
            {frontier.map((paper, index) => <FeaturedPaper key={paper.id} paper={paper} index={index} />)}
          </div>
          <aside className="radar-panel">
            <div className="panel-heading"><span className="eyebrow">90-day signal</span><h2>Research radar</h2><Link href="/radar">Open full radar</Link></div>
            <div className="radar-list">
              {trends.map((trend, index) => (
                <Link href={`/topics/${trend.slug}`} key={trend.slug}>
                  <span className="radar-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="radar-topic"><strong>{trend.name}</strong><small>{trend.status} · {trend.recent} recent papers</small></span>
                  <span className={`trend-change ${trend.growth !== null && trend.growth < 0 ? "negative" : ""}`}>{trend.growth === null ? "N/A" : `${trend.growth > 0 ? "+" : ""}${trend.growth}%`}</span>
                </Link>
              ))}
            </div>
            <p className="panel-note">Trend labels are withheld when the 180-day sample is insufficient.</p>
          </aside>
        </div>
      </section>

      <section className="section cockpit-section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Transfer taxonomy</span><h2>For intelligent cockpits</h2><p>Enter the research graph through the engineering task you need to solve.</p></div><Link href="/cockpit">Explore technical map <ArrowRight size={13} /></Link></div>
          <div className="cockpit-lanes">
            {cockpitLanes.map((lane) => <Link href={lane.href} key={lane.title}><lane.icon size={20} /><strong>{lane.title}</strong><span>{lane.text}</span><ArrowRight size={14} /></Link>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">From reading to action</span><h2>Engineering playbooks</h2><p>Decision frameworks for data, adaptation, fusion and deployment.</p></div><Link href="/playbooks">All playbooks <ArrowRight size={13} /></Link></div>
          <div className="playbook-grid home-playbooks">
            {playbooks.slice(0, 4).map((playbook, index) => <Link href={`/playbooks/${playbook.slug}`} key={playbook.slug}><span className="mono-index">PB-{String(index + 1).padStart(2, "0")}</span><Layers3 size={19} /><h3>{playbook.title}</h3><p>{playbook.summary}</p><span className="text-link">Open decision guide <ArrowRight size={13} /></span></Link>)}
          </div>
        </div>
      </section>

      <section className="section latest-section">
        <div className="container-wide">
          <div className="section-heading"><div><span className="eyebrow">Incremental ingest</span><h2>Latest papers</h2><p>Normalized and deduplicated source records; 25 papers per server-rendered page.</p></div><Link href="/papers">Open all papers <ArrowRight size={13} /></Link></div>
          <PaperTable papers={latest} />
        </div>
      </section>
    </>
  );
}
