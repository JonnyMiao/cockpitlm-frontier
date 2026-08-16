import { listPapers } from "@/lib/repository";

export function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const result = listPapers({
    query: search.get("q") ?? undefined,
    topic: search.get("topic") ?? undefined,
    technique: search.get("technique") ?? undefined,
    cockpitTask: search.get("cockpit") ?? undefined,
    modality: search.get("modality") ?? undefined,
    category: search.get("category") ?? undefined,
    year: search.get("year") ?? undefined,
    frontier: search.get("frontier") ?? undefined,
    sort: (search.get("sort") ?? "newest") as "newest" | "frontier" | "cockpit" | "engineering",
    page: Number(search.get("page") ?? 1),
    pageSize: Number(search.get("pageSize") ?? 25),
  });
  return Response.json(result, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
