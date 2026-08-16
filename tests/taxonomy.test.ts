import assert from "node:assert/strict";
import test from "node:test";
import { enrichPaper } from "../lib/classify";
import type { SourcePaper } from "../types/research";
const paper: SourcePaper={id:"arxiv:test",title:"Streaming Video Language Models with Token Compression",authors:["Researcher"],abstract:"We propose low latency visual token pruning for on-device long video understanding and action recognition.",publishedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),categories:["cs.CV"],primaryCategory:"cs.CV",comment:"Code is available on GitHub.",journalRef:null,doi:null,source:{provider:"arxiv",recordId:"test",url:"https://arxiv.org/abs/test",pdfUrl:null,retrievedAt:new Date().toISOString()}};
test("maps research to topics, techniques and cockpit tasks",()=>{const enriched=enrichPaper(paper);assert.ok(enriched.topics.some((item)=>item.slug==="video-vlm"));assert.ok(enriched.techniques.some((item)=>item.slug==="token-compression"));assert.ok(enriched.cockpitTasks.some((item)=>item.slug==="edge-deployment"));assert.ok(enriched.intelligence.scores.engineering.value>=4)});
