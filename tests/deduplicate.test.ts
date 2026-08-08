import assert from "node:assert/strict";
import test from "node:test";
import { deduplicatePapers } from "../lib/deduplicate";
import type { SourcePaper } from "../types/research";
const base: SourcePaper={id:"a",title:"Unified Video Language Models",authors:["Ada Lovelace","Alan Turing"],abstract:"Short.",publishedAt:"2025-01-01",updatedAt:"2025-01-01",categories:["cs.CV"],primaryCategory:"cs.CV",comment:null,journalRef:null,doi:null,source:{provider:"arxiv",recordId:"2501.00001v1",url:"https://arxiv.org/abs/2501.00001v1",pdfUrl:null,retrievedAt:"2025-01-02"}};
test("deduplicates arXiv versions and keeps richer metadata",()=>{const result=deduplicatePapers([base,{...base,id:"b",abstract:"A substantially longer abstract with details.",comment:"Code available",source:{...base.source,recordId:"2501.00001v2"}}]);assert.equal(result.length,1);assert.equal(result[0].comment,"Code available")});
