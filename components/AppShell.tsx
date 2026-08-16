/* eslint-disable @next/next/no-html-link-for-pages -- Full-page navigation avoids a deployed vinext router stall. */
import { Code2, Database, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function AppShell({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const navigation = [
    [t(locale, "前沿", "Frontier"), "/"], [t(locale, "论文", "Papers"), "/papers"], [t(locale, "主题", "Topics"), "/topics"], [t(locale, "模型", "Models"), "/models"],
    [t(locale, "数据集", "Datasets"), "/datasets"], [t(locale, "基准", "Benchmarks"), "/benchmarks"], [t(locale, "智能座舱", "Cockpit"), "/cockpit"], [t(locale, "工程手册", "Playbooks"), "/playbooks"],
  ] as const;
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-main container-wide">
          <a className="brand" href="/" aria-label={t(locale, "CockpitLM Frontier 首页", "CockpitLM Frontier home")}>
            <span className="brand-mark">CLM</span>
            <span><strong>CockpitLM Frontier</strong><small>{t(locale, "前沿研究情报", "Research Intelligence")}</small></span>
          </a>
          <form className="header-search" action="/papers">
            <Search size={15} aria-hidden="true" />
            <input name="q" aria-label={t(locale, "全站研究搜索", "Global research search")} placeholder={t(locale, "搜索论文、方法、模型、数据集…", "Search papers, methods, models, datasets…")} />
            <kbd>/</kbd>
          </form>
          <div className="header-actions">
            <a className="icon-button" href="https://github.com/JonnyMiao/cockpitlm-frontier" aria-label={t(locale, "GitHub 代码仓库", "GitHub repository")} target="_blank" rel="noreferrer"><Code2 size={17} /></a>
            <LanguageToggle locale={locale} />
            <ThemeToggle locale={locale} />
          </div>
        </div>
        <nav className="site-nav container-wide" aria-label={t(locale, "主导航", "Primary navigation")}>
          {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          <a className="nav-radar" href="/radar"><span className="status-dot" /> {t(locale, "研究雷达", "Research Radar")}</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container-wide footer-grid">
          <div><strong>CockpitLM Frontier</strong><p>{t(locale, "论文 → 方法 → 模型 → 基准 → 座舱迁移 → 工程决策", "Paper → Method → Model → Benchmark → Cockpit Transfer → Engineering Decision")}</p></div>
          <div className="footer-meta"><span><Database size={14} /> {t(locale, "保留来源的元数据", "Metadata with provenance")}</span><span>{t(locale, "未知信息保持未知", "Unknown stays unknown")}</span></div>
        </div>
      </footer>
    </div>
  );
}
