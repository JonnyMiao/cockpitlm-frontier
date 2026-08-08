import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function Pagination({ page, totalPages, searchParams, locale }: { page: number; totalPages: number; searchParams: Record<string, string | undefined>; locale: Locale }) {
  if (totalPages <= 1) return null;
  const href = (target: number) => ({ pathname: "/papers", query: { ...searchParams, page: String(target) } });
  const pages = [...new Set([1, Math.max(1, page - 1), page, Math.min(totalPages, page + 1), totalPages])].sort((a, b) => a - b);
  return (
    <nav className="pagination" aria-label={t(locale, "论文分页", "Paper pages")}>
      {page > 1 ? <Link href={href(page - 1)}><ChevronLeft size={14} /> {t(locale, "上一页", "Previous")}</Link> : <span className="disabled"><ChevronLeft size={14} /> {t(locale, "上一页", "Previous")}</span>}
      <div>{pages.map((number, index) => <span key={number}>{index > 0 && number - pages[index - 1] > 1 && <i>…</i>}<Link className={number === page ? "active" : ""} href={href(number)}>{number}</Link></span>)}</div>
      {page < totalPages ? <Link href={href(page + 1)}>{t(locale, "下一页", "Next")} <ChevronRight size={14} /></Link> : <span className="disabled">{t(locale, "下一页", "Next")} <ChevronRight size={14} /></span>}
    </nav>
  );
}
