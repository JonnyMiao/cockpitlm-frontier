import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deduplicatePapers } from "../lib/deduplicate";
import { runProviderIngestion } from "../lib/ingestion/pipeline";
import { ArxivProvider } from "../lib/providers/arxiv";
import type { SourcePaper } from "../types/research";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "data", "papers.json");

const QUERIES = [
  'all:"vision language model"',
  'all:"multimodal large language model"',
  'all:"video language model" OR all:"video-language model"',
  'all:"native multimodal" OR all:"omni-modal" OR all:"omnimodal"',
  'all:"world model" AND (all:vision OR all:video OR all:multimodal)',
  'all:"multimodal agent" OR all:"vision-language agent"',
  'all:"multimodal reasoning" OR all:"visual reasoning"',
  'all:"efficient vision-language" OR all:"on-device VLM" OR all:"token compression"',
  'all:"multimodal fusion" OR all:"audio-visual reasoning"',
  'all:"vision-language" AND (all:distillation OR all:quantization OR all:"fine-tuning")',
];

function argument(name: string, fallback: number): number {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix))?.slice(prefix.length);
  return value ? Math.max(1, Number(value)) : fallback;
}

function log(event: string, details: Record<string, unknown>): void {
  process.stdout.write(`${JSON.stringify({ timestamp: new Date().toISOString(), event, ...details })}\n`);
}

function isInScope(paper: SourcePaper): boolean {
  const text = `${paper.title} ${paper.abstract}`;
  return /vision[- ]language|visual language|language and vision|multimodal|multi-modal|video understanding|video reasoning|world model|omni[- ]?modal|cross[- ]modal|audio[- ]visual|vision-language-action|\bVLMs?\b|\bMLLMs?\b|GUI agent/i.test(text);
}

async function retry<T>(operation: () => Promise<T>, label: string, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      log("provider_retry", { label, attempt, error: error instanceof Error ? error.message : String(error) });
      if (attempt < attempts) await new Promise((resolvePromise) => setTimeout(resolvePromise, attempt * 4_000));
    }
  }
  throw lastError;
}

async function existingRecords(): Promise<SourcePaper[]> {
  try {
    return JSON.parse(await readFile(outputPath, "utf8")) as SourcePaper[];
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const limit = argument("limit", 1_200);
  const perQuery = Math.min(300, Math.max(80, Math.ceil((limit * 1.4) / QUERIES.length)));
  const provider = new ArxivProvider();
  const fetched: SourcePaper[] = [];
  const failures: Array<{ query: string; error: string }> = [];
  log("ingestion_started", { provider: provider.name, queryCount: QUERIES.length, target: limit, perQuery });

  for (const [index, query] of QUERIES.entries()) {
    try {
      const report = await retry(() => runProviderIngestion(provider, query, perQuery), `arxiv-query-${index + 1}`);
      fetched.push(...report.records);
      log("query_completed", { queryIndex: index + 1, fetched: report.fetched, accepted: report.accepted, rejected: report.rejected, duplicates: report.deduplicated });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ query, error: message });
      log("query_failed", { queryIndex: index + 1, error: message });
    }
    if (index < QUERIES.length - 1) await new Promise((resolvePromise) => setTimeout(resolvePromise, 3_100));
  }

  const previous = await existingRecords();
  const records = deduplicatePapers([...fetched, ...previous])
    .filter((paper) => paper.title !== "Untitled" && paper.abstract !== "Unavailable" && isInScope(paper))
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .slice(0, limit);

  if (!records.length) throw new Error("All providers failed and no previous corpus is available; refusing to replace the dataset.");
  await mkdir(dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  await rename(temporaryPath, outputPath);
  log("ingestion_completed", { provider: provider.name, fetched: fetched.length, previous: previous.length, stored: records.length, failures });
}

main().catch((error) => {
  log("ingestion_failed", { error: error instanceof Error ? error.message : String(error) });
  process.exitCode = 1;
});
