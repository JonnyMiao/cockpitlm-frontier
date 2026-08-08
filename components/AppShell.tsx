import Link from "next/link";
import { Code2, Database, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  ["Frontier", "/"], ["Papers", "/papers"], ["Topics", "/topics"], ["Models", "/models"],
  ["Datasets", "/datasets"], ["Benchmarks", "/benchmarks"], ["Cockpit", "/cockpit"], ["Playbooks", "/playbooks"],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-main container-wide">
          <Link className="brand" href="/" aria-label="CockpitLM Frontier home">
            <span className="brand-mark">CLM</span>
            <span><strong>CockpitLM Frontier</strong><small>Research Intelligence</small></span>
          </Link>
          <form className="header-search" action="/papers">
            <Search size={15} aria-hidden="true" />
            <input name="q" aria-label="Global research search" placeholder="Search papers, methods, models, datasets…" />
            <kbd>/</kbd>
          </form>
          <div className="header-actions">
            <Link className="icon-button" href="https://github.com/JonnyMiao/cockpitlm-frontier" aria-label="GitHub repository" target="_blank" rel="noreferrer"><Code2 size={17} /></Link>
            <ThemeToggle />
          </div>
        </div>
        <nav className="site-nav container-wide" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link className="nav-radar" href="/radar"><span className="status-dot" /> Research Radar</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container-wide footer-grid">
          <div><strong>CockpitLM Frontier</strong><p>Paper → Method → Model → Benchmark → Cockpit Transfer → Engineering Decision</p></div>
          <div className="footer-meta"><span><Database size={14} /> Metadata with provenance</span><span>Unknown stays unknown</span></div>
        </div>
      </footer>
    </div>
  );
}
