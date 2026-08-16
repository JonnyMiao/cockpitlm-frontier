import { topicTrends } from "@/lib/repository";
export function GET(){return Response.json({ windowDays: 90, comparisonDays: 90, topics: topicTrends() }, { headers: { "Cache-Control": "public, max-age=300" } })}
