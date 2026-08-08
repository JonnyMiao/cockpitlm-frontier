import Link from "next/link";
export default function NotFound() { return <div className="container not-found"><span className="eyebrow">404 · Record unavailable</span><h1>Paper not found</h1><p>The record may have been deduplicated or removed by a source update.</p><Link href="/papers">Return to all papers</Link></div>; }
