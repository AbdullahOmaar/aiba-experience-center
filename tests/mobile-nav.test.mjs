import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root=new URL("../",import.meta.url);
test("mobile section navigation exposes only valid in-page destinations",async()=>{
  const html=await readFile(new URL("index.html",root),"utf8");
  const ids=[...html.matchAll(/id="([^"]+)"/g)].map(match=>match[1]);
  const start=html.indexOf("<nav class=\"mobile-section-nav\"");
  const end=html.indexOf("</nav>",start);
  const nav=start>=0&&end>=0?html.slice(start,end+6):"";
  assert.ok(nav,"mobile section navigation exists");
  const destinations=[...nav.matchAll(/href="#([^"]+)"/g)].map(match=>match[1]);
  assert.ok(destinations.length>=7);
  for(const destination of destinations)assert.ok(ids.includes(destination),"missing #"+destination);
});
test("mobile section navigation has a no-storage scroll-spy implementation",async()=>{
  const source=await readFile(new URL("src/mobile-nav.js",root),"utf8");
  assert.ok(source.includes("IntersectionObserver"));
  assert.ok(source.includes("aria-current"));
  assert.ok(!/localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest/.test(source));
});
test("mobile section labels have English and Arabic copy",async()=>{
  const source=await readFile(new URL("src/app.js",root),"utf8");
  assert.ok(source.includes("navFinancial:"));
  assert.ok(source.includes("navTrust:"));
  assert.ok(source.includes("مالي"));
  assert.ok(source.includes("الأمان"));
});
