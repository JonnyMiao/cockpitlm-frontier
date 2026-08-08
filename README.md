# CockpitLM Frontier

**VLM · OMNI · World Models for Intelligent Cockpits**

CockpitLM Frontier is a research-intelligence platform for converting frontier multimodal research into cockpit research plans and engineering decisions. It connects:

> Paper → Method → Model → Dataset / Benchmark → Trend → Cockpit Relevance → Engineering Recommendation

It is intentionally not a paper-listing demo. The repository includes a real research corpus, modular ingestion providers, normalization and deduplication, a relational schema, deterministic research-intelligence layers, server-side filtering, topic momentum analysis, cockpit transfer taxonomy and engineering playbooks.

## Current capabilities

- 1,200 real source records fetched from the public arXiv API during the initial ingestion run.
- Modular arXiv, OpenAlex and Crossref provider adapters.
- Fetch → parse → validate → normalize → deduplicate → classify → publish pipeline.
- DOI-first and arXiv-ID-first deduplication, with normalized-title / year / author-overlap fallback.
- Source metadata separated from generated taxonomy, scoring and cockpit-transfer intelligence.
- Server-rendered, paginated paper search with topic, cockpit task, modality, category, year and score filters.
- Paper detail pages with provenance, architecture signals, three decision scores, cockpit transfer and recommended experiments.
- Topic dossiers, 90-day research radar, cockpit technical map, model / dataset / benchmark databases and engineering playbooks.
- Chinese-first interface with persistent Chinese / English switching across all research workflows.
- Light and dark themes with desktop-first responsive layouts.

## Architecture

```text
Academic providers
  ├─ arXiv (active bulk ingestion)
  ├─ OpenAlex (adapter)
  └─ Crossref (adapter)
        ↓
Fetch → Parse → Validate → Normalize → Deduplicate
        ↓
SourcePaper corpus (immutable source fields + provenance)
        ↓
Taxonomy → Three Scores → Cockpit Transfer → Experiments
        ↓
Repository / API → Next-compatible server routes → Research UI
        ↓
Cloudflare Worker + D1 schema and migrations
```

The application uses React 19, strict TypeScript, vinext and Cloudflare Worker-compatible ESM output. Drizzle defines the D1 / SQLite schema. Source metadata and generated research intelligence are stored in separate entities.

## Project structure

```text
app/                    Routes, pages and JSON APIs
components/             Reusable research UI components
data/papers.json        Ingested, source-traceable arXiv corpus
data/entities.ts        Source-linked model, dataset and benchmark profiles
data/playbooks.ts       Maintained engineering decision guides
db/schema.ts            Relational research knowledge schema
drizzle/                Generated, versioned SQLite / D1 migrations
lib/providers/          Modular metadata-provider adapters
lib/ingestion/          Validation and ingestion orchestration
lib/                    Normalization, deduplication, taxonomy, scoring, repository
scripts/ingest.ts       Incremental ingestion entry point
tests/                  Parsing, normalization, deduplication, taxonomy, scoring, search and render tests
worker/                  Cloudflare Worker entry point
```

## Install and run

Requirements: Node.js 22.13 or newer and npm.

```bash
npm ci
npm run dev
```

The public arXiv ingestion requires no API key. `.env.example` documents optional provider configuration when new enrichers are enabled. Never commit provider secrets.

## Database and migrations

The logical D1 binding is `DB`, configured in `.openai/hosting.json`. The schema includes:

- `papers`, `paper_authors` and source identifiers / provenance;
- `topics`, `methods`, `cockpit_tasks` and many-to-many paper relations;
- `models`, `datasets`, `benchmarks` and paper-to-entity relations;
- `research_intelligence` with separately versioned scoring output;
- `ingestion_runs` for provider-level operational history.

Generate a migration after editing `db/schema.ts`:

```bash
npm run db:generate
```

Inspect every generated SQL file under `drizzle/` before deployment. Production deployment owns the physical D1 resource and applies packaged migrations. The checked-in source corpus is also a read-only operational fallback so the research UI does not fail when D1 is empty or unavailable.

## Ingestion and incremental updates

Run the complete arXiv ingestion target:

```bash
npm run ingest
```

Run a smaller development refresh:

```bash
npm run ingest:quick
```

The script queries multiple research directions, validates records, normalizes metadata, deduplicates against the existing corpus, preserves provenance and writes the corpus atomically. It logs structured JSON and retries each provider query. One failed query is recorded and does not discard successful results or the previous corpus.

`.github/workflows/ingest.yml` runs a daily incremental refresh and commits only real corpus changes after validation. Citation enrichment and conference-specific refreshes should be separate scheduled jobs because they have different rate limits and update semantics.

### Adding a provider

1. Implement `ResearchProvider` from `lib/providers/types.ts`.
2. Map the provider response into `SourcePaper`; do not place generated summaries or scores in source fields.
3. Preserve the provider record ID, canonical source URL and retrieval timestamp.
4. Register the provider in `lib/providers/index.ts`.
5. Add fixture-based parsing and failure tests.
6. Add its stable identifier to the canonical-key precedence when appropriate.
7. Respect provider rate limits, retry headers, licensing and cache guidance.

## Taxonomy and scoring

Taxonomy rules live in `lib/taxonomy.ts`. The main research topics are multimodal fusion, video VLM, native OMNI, VLM fine-tuning, distillation, edge VLM, world models, multimodal agents and multimodal reasoning.

Cockpit taxonomy covers perception, driver / occupant state, behavior / events, intention / reasoning, interaction, agent / execution and deployment. A paper can map to multiple topics and cockpit tasks, each with visible evidence.

To add a taxonomy entry:

1. Add a stable slug, name and specific evidence terms.
2. For a cockpit task, add a group and transfer rationale.
3. Add a positive and negative fixture test.
4. Review corpus-wide match counts for overly broad terms.
5. Bump the classifier version when the meaning changes.

The three scores are independent 1–5 decision aids:

- **Frontier Score**: recency and frontier-topic signals—not citation impact.
- **Cockpit Relevance**: explicit transferable task and engineering signals.
- **Engineering Readiness**: verified metadata signals for code / artifacts and deployment methods.

Each score includes an explanation. They are deliberately coarse heuristics and never replace verified results, artifact review or safety validation.

## APIs

- `GET /api/papers` — paginated search and filtering.
- `GET /api/papers/:id` — enriched paper detail with provenance.
- `GET /api/radar` — sample-aware 90-day topic comparison.
- `GET /api/health` — service, provider and corpus status.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:render
```

Tests cover ingestion parsing, normalization, deduplication, taxonomy mapping, scoring, search, filtering, pagination and server rendering.

## Deployment

The production build emits a Cloudflare Worker-compatible application under `dist/`. Sites packages the exact validated build, `.openai/hosting.json` and Drizzle migrations, then saves and deploys a version.

## Data sources

- arXiv public API for the checked-in research corpus.
- OpenAlex and Crossref adapters for optional metadata enrichment.
- Official model cards, dataset sites and benchmark projects for maintained knowledge-entity profiles.

Every paper record stores provider, provider record ID, source URL, source update time and retrieval time. Missing data is displayed as `Unknown`, `Not reported` or `Unavailable`; it is never guessed.

## Known limitations

- The checked-in corpus is a targeted snapshot, not a claim of complete field coverage.
- arXiv metadata often omits code, weights, training recipes, datasets and final venue information.
- Research intelligence currently uses deterministic abstract-level extraction and rules; quantitative claims are intentionally not extracted without verification.
- Topic momentum represents this corpus and query strategy, not the total publication volume of the field.
- OpenReview, CVF Open Access, ACL Anthology, Semantic Scholar, GitHub and Hugging Face enrichment are planned provider modules, not silently simulated data.
- Cockpit transfer is a research recommendation that still requires domain data, controlled experiments, safety review and target-hardware profiling.
