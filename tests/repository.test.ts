import assert from "node:assert/strict";
import test from "node:test";
import { allPapers, getPaper, listPapers, topicTrends } from "../lib/repository";
import { paperSlug } from "../lib/routes";
test("serves a real paginated corpus",()=>{const first=listPapers({page:1,pageSize:25});assert.equal(first.items.length,25);assert.ok(first.total>=1000);assert.ok(first.totalPages>=40);assert.ok(first.items.every((paper)=>paper.source.url.startsWith("https://")))});
test("filters and looks up papers",()=>{const video=listPapers({topic:"video-vlm",pageSize:10});assert.ok(video.total>0);assert.ok(video.items.every((paper)=>paper.topics.some((topic)=>topic.slug==="video-vlm")));assert.equal(getPaper(allPapers()[0].id)?.id,allPapers()[0].id)});
test("round-trips DOI identifiers without creating nested route segments",()=>{const paper=allPapers().find((item)=>item.id.includes("/"));assert.ok(paper);const slug=paperSlug(paper.id);assert.ok(!slug.includes("/"));assert.equal(getPaper(slug)?.id,paper.id)});
test("computes sample-aware topic trends",()=>{const trends=topicTrends();assert.ok(trends.length>0);assert.ok(trends.every((trend)=>trend.growth===null||Number.isFinite(trend.growth)))});
