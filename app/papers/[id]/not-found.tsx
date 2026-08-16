import Link from "next/link";
import { getLocale, t } from "@/lib/i18n";

export default async function NotFound() { const locale = await getLocale(); return <div className="container not-found"><span className="eyebrow">404 · {t(locale,"记录不可用","Record unavailable")}</span><h1>{t(locale,"未找到论文","Paper not found")}</h1><p>{t(locale,"该记录可能已被去重，或在来源更新后被移除。","The record may have been deduplicated or removed by a source update.")}</p><Link href="/papers">{t(locale,"返回全部论文","Return to all papers")}</Link></div>; }
