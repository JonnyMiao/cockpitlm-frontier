import { getPaper } from "@/lib/repository";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const paper = getPaper((await context.params).id);
  return paper ? Response.json(paper, { headers: { "Cache-Control": "public, max-age=300" } }) : Response.json({ error: "Paper not found" }, { status: 404 });
}
