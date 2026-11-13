import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root=new URL("../",import.meta.url);
test("quick navigation search exposes a complete combobox relationship",async()=>{
  const html=await readFile(new URL("index.html",root),"utf8");
  assert.ok(html.includes("role=\"combobox\""));
  assert.ok(html.includes("aria-controls=\"quick-nav-results\""));
  assert.ok(html.includes("id=\"quick-nav-results\" role=\"listbox\""));
  assert.ok(html.includes("id=\"quick-nav-status\" aria-live=\"polite\""));
  assert.ok(html.includes("id=\"quick-nav-count\""));
});
test("quick navigation announces counts and places active descendant on the combobox",async()=>{
  const source=await readFile(new URL("src/quick-nav.js",root),"utf8");
  assert.ok(source.includes("input.setAttribute(\"aria-activedescendant\""));
  assert.ok(!source.includes("results.setAttribute(\"aria-activedescendant\""));
  assert.ok(source.includes("countLimited"));
  assert.ok(source.includes("status.textContent"));
  assert.ok(source.includes("aria-expanded"));
  assert.ok(source.includes("PageDown"));
  assert.ok(source.includes("PageUp"));
  assert.ok(source.includes("normalizeSearchText"));
});
test("quick navigation provides bilingual accessible search labels and result counts",async()=>{
  const source=await readFile(new URL("src/quick-nav.js",root),"utf8");
  assert.ok(source.includes("searchLabel:\"Search the experience\""));
  assert.ok(source.includes("searchLabel:\"ابحث داخل التجربة\""));
  assert.ok(source.includes("countNone:\"No results\""));
  assert.ok(source.includes("countNone:\"لا توجد نتائج\""));
});

test("quick navigation hands focus to the destination for every result type",async()=>{
  const source=await readFile(new URL("src/quick-nav.js",root),"utf8");
  assert.ok(source.includes("function focusDestination("));
  assert.ok(source.includes("function focusSection("));
  assert.ok(source.includes('focusDestination(document.querySelector("#module-detail"),document.querySelector("#module-explorer"))'));
  assert.ok(source.includes('focusDestination(document.querySelector("#feature-explanation"),document.querySelector("#features"))'));
  assert.ok(source.includes('focusDestination(stage?.querySelector(".flow-step")||stage,document.querySelector("#journeys"))'));
  assert.ok(source.includes('focusDestination(card,document.querySelector("#financial-concepts"))'));
  assert.ok(source.includes("target.focus({preventScroll:true})"));
});

test("financial concept navigation focuses the re-rendered selected card",async()=>{
  const source=await readFile(new URL("src/quick-nav.js",root),"utf8");
  const clickIndex=source.indexOf('document.querySelector(selector)?.click()');
  const refreshIndex=source.indexOf('const selectedCard=document.querySelector(selector)',clickIndex);
  const focusIndex=source.indexOf('focusDestination(selectedCard,document.querySelector("#financial-concepts"))',refreshIndex);
  assert.ok(clickIndex>=0&&refreshIndex>clickIndex&&focusIndex>refreshIndex);
});

test("quick navigation does not restore trigger focus after a destination handoff",async()=>{
  const source=await readFile(new URL("src/quick-nav.js",root),"utf8");
  assert.ok(source.includes("let destinationOwnsFocus = false;"));
  assert.ok(source.includes("destinationOwnsFocus=true"));
  assert.ok(source.includes("const keepDestinationFocus=destinationOwnsFocus"));
  assert.ok(source.includes("if(!keepDestinationFocus&&previousFocus?.isConnected)previousFocus.focus()"));
});

test("quick navigation exposes the full match set and list position metadata",async()=>{
  const source=await readFile(new URL("src/quick-nav.js",root),"utf8");
  assert.ok(source.includes("currentItems=matches;"));
  assert.ok(!source.includes("slice(0,12)"));
  assert.ok(source.includes('button.setAttribute("aria-posinset",String(index+1))'));
  assert.ok(source.includes('button.setAttribute("aria-setsize",String(currentItems.length))'));
  assert.ok(source.includes("button.tabIndex=-1"));
});
test("quick navigation announces the current search query in both languages",async()=>{
  const source=await readFile(new URL("src/quick-nav.js",root),"utf8");
  assert.ok(source.includes('resultsFor:"Search results for"'));
  assert.ok(source.includes('resultsFor:"نتائج البحث عن"'));
  assert.ok(source.includes('query?countText+". "+l.resultsFor+" "+input.value.trim():countText'));
});
