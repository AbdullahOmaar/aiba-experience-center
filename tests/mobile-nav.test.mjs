import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root=new URL("../",import.meta.url);
test("mobile section navigation exposes only valid in-page destinations",async()=>{
  const html=await readFile(new URL("index.html",root),"utf8");
  const ids=[...html.matchAll(/id="([^"]+)"/g)].map(match=>match[1]);
  const nav=html.match(/<nav class="mobile-section-nav"[sS]*?<\/nav>/)?.[0];
  assert.ok(nav,"mobile section navigation exists");
  const destinations=[...nav.matchAll(/href="#([^"]+)"/g)].map(match=>match[1]);
  assert.ok(destinations.length>=7);
  for(const destination of destinations)assert.ok(ids.includes(destination),`missing #${destination}`);
});
test("mobile section navigation has a no-storage scroll-spy implementation",async()=>{
  const source=await readFile(new URL("src/mobile-nav.js",root),"utf8");
  assert.match(source,/IntersectionObserver/);
  assert.match(source,/aria-current/);
  assert.doesNotMatch(source,/localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest/);
});
test("mobile section labels have English and Arabic copy",async()=>{
  const source=await readFile(new URL("src/app.js",root),"utf8");
  assert.match(source,/navFinancial:"Financial"/);
  assert.match(source,/navTrust:"Trust"/);
  assert.match(source,/navFinancial:"مالي"/);
  assert.match(source,/navTrust:"الأمان"/);
});
