export function PageHeader({ eyebrow, title, description, meta }: { eyebrow?: string; title: string; description: string; meta?: React.ReactNode }) {
  return (
    <header className="page-header container">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      <p>{description}</p>
      {meta && <div className="page-meta">{meta}</div>}
    </header>
  );
}
