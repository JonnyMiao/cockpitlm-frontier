import assert from "node:assert/strict";
import test from "node:test";
import { canonicalPaperKey, normalizeArxivId, normalizeDoi, normalizeTitle } from "../lib/normalize";
import type { SourcePaper } from "../types/research";

const paper: SourcePaper = { id:"raw",title:"  A  Vision–Language Model, v2 ",authors:["A. Author"],abstract:"Abstract",publishedAt:"2026-01-01",updatedAt:"2026-01-01",categories:["cs.CV"],primaryCategory:"cs.CV",comment:null,journalRef:null,doi:"https://doi.org/10.1000/ABC",source:{provider:"arxiv",recordId:"2601.00001v2",url:"https://arxiv.org/abs/2601.00001v2",pdfUrl:null,retrievedAt:"2026-01-02"}};

test("normalizes identifiers and titles",()=>{assert.equal(normalizeDoi(paper.doi),"10.1000/abc");assert.equal(normalizeArxivId("2601.00001v3"),"2601.00001");assert.equal(normalizeTitle(paper.title),"a vision language model");assert.equal(canonicalPaperKey(paper),"doi:10.1000/abc")});
