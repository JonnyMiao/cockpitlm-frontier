import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server renders the research command center", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /CockpitLM Frontier/);
  assert.match(html, /Frontier multimodal research/);
  assert.match(html, /Research radar/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("server renders the paginated papers workspace", async () => {
  const response = await render("/papers?sort=frontier&page=1");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /All papers/);
  assert.match(html, /Apply filters/);
  assert.match(html, /server-side filtering/i);
});
