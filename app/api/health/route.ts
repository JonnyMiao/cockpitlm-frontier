import { getDashboardStats } from "@/lib/repository";
export function GET(){return Response.json({ status: "ok", service: "cockpitlm-frontier", providers: ["arxiv", "openalex", "crossref"], corpus: getDashboardStats() })}
