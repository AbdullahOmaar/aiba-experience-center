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
  assert.equal(destinations.length,10);
  assert.ok(destinations.includes("top"));
  assert.ok(destinations.includes("final-entry"));
  assert.ok(destinations.includes("financial-concepts"));
  for(const destination of destinations)assert.ok(ids.includes(destination),"missing #"+destination);
});
test("mobile section navigation has a no-storage scroll-spy implementation",async()=>{
  const source=await readFile(new URL("src/mobile-nav.js",root),"utf8");
  assert.ok(source.includes("IntersectionObserver"));
  assert.ok(source.includes("const focusSection=id=>"));
  assert.ok(source.includes("focusSection(id)"));
  assert.ok(source.includes("heading.focus({preventScroll:true})"));
  assert.ok(source.includes("aria-current"));
  assert.ok(!/localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest/.test(source));
});
test("mobile section labels have English and Arabic copy",async()=>{
  const source=await readFile(new URL("src/app.js",root),"utf8");
  assert.ok(source.includes("navTop:"));
  assert.ok(source.includes("navNextStep:"));
  assert.ok(source.includes("أعلى الصفحة"));
  assert.ok(source.includes("الخطوة التالية"));
  assert.ok(source.includes("navFinancial:"));
  assert.ok(source.includes("navTrust:"));
  assert.ok(source.includes("مالي"));
  assert.ok(source.includes("الأمان"));
});

test("quick-navigation section entries resolve to existing section IDs",async()=>{
  const html=await readFile(new URL("index.html",root),"utf8");
  const source=await readFile(new URL("src/quick-nav.js",root),"utf8");
  const ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(match=>match[1]));
  const destinations=[...source.matchAll(/\{id:"([^"]+)",key:"section/g)].map(match=>match[1]);
  assert.ok(destinations.length>=9);
  for(const destination of destinations)assert.ok(ids.has(destination),"missing #"+destination);
});

test("active mobile section chip remains visible in the horizontal rail",async()=>{
  const source=await readFile(new URL("src/mobile-nav.js",root),"utf8");
  assert.ok(source.includes('link.setAttribute("aria-current","location")'));
  assert.ok(source.includes("activeLink&&nav.getClientRects().length"));
  assert.ok(source.includes('activeLink.scrollIntoView({behavior,block:"nearest",inline:"nearest"})'));
  assert.ok(source.includes('matchMedia("(prefers-reduced-motion: reduce)")'));
});

test("mobile scroll spy does not auto-scroll a hidden desktop navigation rail",async()=>{
  const source=await readFile(new URL("src/mobile-nav.js",root),"utf8");
  assert.ok(source.includes("if(activeLink&&nav.getClientRects().length)"));
});

test("mobile rail moves focus to the selected section heading",async()=>{
  const source=await readFile(new URL("src/mobile-nav.js",root),"utf8");
  assert.ok(source.includes("const focusSection=id=>"));
  assert.ok(source.includes('target?.querySelector("h1,h2,h3")'));
  assert.ok(source.includes('heading.setAttribute("tabindex","-1")'));
  assert.ok(source.includes('heading.focus({preventScroll:true})'));
  assert.ok(source.includes("focusSection(id)"));
});

test("compact tablet headers use the section rail before the narrow-phone layout",async()=>{
  const css=await readFile(new URL("../styles.css",root),"utf8");
  assert.ok(css.includes("@media(max-width:1020px)"));
  assert.ok(css.includes(".desktop-nav{display:none}"));
  assert.ok(css.includes(".mobile-section-nav{display:flex"));
  assert.ok(css.includes("@media(max-width:760px)"));
});
