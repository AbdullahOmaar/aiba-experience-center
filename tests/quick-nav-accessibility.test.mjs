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

test("quick navigation moves type labels below content on narrow phones",async()=>{
  const css=await readFile(new URL("../explorer.css",import.meta.url),"utf8");
  assert.ok(css.includes("@media(max-width:560px)"));
  assert.ok(css.includes(".quick-nav-option{grid-template-columns:30px minmax(0,1fr)"));
  assert.ok(css.includes(".quick-nav-option-type{grid-column:2"));
  assert.ok(css.includes("@media(max-width:380px)"));
});

test("quick navigation remains bounded and usable in short phone viewports",async()=>{
  const css=await readFile(new URL("../explorer.css",import.meta.url),"utf8");
  assert.ok(css.includes("@media(max-height:560px)"));
  assert.ok(css.includes("@media(max-height:440px) and (max-width:760px)"));
  assert.ok(css.includes("@media(max-height:360px) and (max-width:760px)"));
  assert.ok(css.includes(".quick-nav-results{max-height:31dvh"));
  assert.ok(css.includes(".quick-nav-close{width:44px;height:44px}"));
});
test("quick navigation shortcut is exposed to assistive technology",async()=>{
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  assert.ok(html.includes('aria-keyshortcuts="Control+K Meta+K /"'));
});

test("quick navigation exposes shortcuts and compacts for short viewports",async()=>{
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  const css=await readFile(new URL("../explorer.css",import.meta.url),"utf8");
  assert.ok(html.includes('aria-keyshortcuts="Control+K Meta+K /"'));
  assert.ok(css.includes("@media(max-height:560px)"));
  assert.ok(css.includes("@media(max-height:440px) and (max-width:760px)"));
  assert.ok(css.includes("@media(max-height:360px) and (max-width:760px)"));
});

test("re-rendered module and feature controls hand focus to replacement controls",async()=>{
  const source=await readFile(new URL("../src/app.js",import.meta.url),"utf8");
  assert.ok(source.includes("function focusFreshTarget(selector)"));
  assert.ok(source.includes('target.setAttribute("tabindex","-1");target.focus();'));
  assert.ok(source.includes('selectModule(m.id,false,"#module-grid .module-card.is-selected")'));
  assert.ok(source.includes('focusFreshTarget("#module-detail .detail-facet:nth-child("+(i+1)+")")'));
  assert.ok(source.includes('selectModule(m.id,false,"#feature-list .feature-module.is-active")'));
  assert.ok(source.includes('focusFreshTarget("#feature-explanation .pager-button:first-child")'));
  assert.ok(source.includes('focusFreshTarget("#feature-explanation .pager-button:last-child")'));
});
test("journey and financial selections keep focus after their DOM is re-rendered",async()=>{
  const source=await readFile(new URL("../src/app.js",import.meta.url),"utf8");
  assert.ok(source.includes('focusFreshTarget("#journey-tab-"+j.id)'));
  assert.ok(source.includes('focusFreshTarget("#journey-stage .flow-step:nth-child("+(i+1)+")")'));
  assert.ok(source.includes('focusFreshTarget("#financial-map [data-financial-concept="+c.id+"]")'));
  assert.ok(source.includes('selectModule(id,true,"#module-detail")'));
});

test("all rerendered module entry points preserve focus in their replacement view",async()=>{
  const source=await readFile(new URL("../src/app.js",import.meta.url),"utf8");
  assert.ok(source.includes('b.addEventListener("click",()=>selectModule(m.id,true,"#module-detail"))'));
  assert.ok(source.includes('selectModule(next.id,false,"#graph-nodes .node-"+next.id)'));
  assert.ok(source.includes('selectModule(m.id,true,"#module-detail")'));
  assert.ok(source.includes('selectModule(m.id,false,"#module-grid .module-card.is-selected")'));
  assert.ok(source.includes('selectModule(m.id,false,"#feature-list .feature-module.is-active")'));
  assert.ok(source.includes('selectModule(target.id,false,"#module-detail")'));
  assert.ok(source.includes('selectModule(id,false,"#feature-explanation")'));
});

test("quick navigation shows a cross-platform shortcut when header space allows",async()=>{
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  const css=await readFile(new URL("../explorer.css",import.meta.url),"utf8");
  assert.ok(html.includes("<kbd>Ctrl / ⌘ K</kbd>"));
  assert.ok(css.includes("@media(max-width:1040px){.quick-nav-trigger kbd{display:none}}"));
});

test("cross-platform shortcut hint is hidden when the header becomes compact",async()=>{
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  const css=await readFile(new URL("../explorer.css",import.meta.url),"utf8");
  assert.ok(html.includes("<kbd>Ctrl / ⌘ K</kbd>"));
  assert.ok(css.includes("@media(max-width:1040px){.quick-nav-trigger kbd{display:none}}"));
});
test("performance inventory clearly labels its limitations and open acceptance",async()=>{
  const readme=await readFile(new URL("../README.md",import.meta.url),"utf8");
  assert.ok(readme.includes("195,969 raw bytes"));
  assert.ok(readme.includes("163,043 raw bytes"));
  assert.ok(readme.includes("uncompressed Git blob sizes only"));
  assert.ok(readme.includes("AC-16 budget/lazy-loading acceptance remains OPEN"));
});

test("quick navigation controls retain 44px touch targets in short viewports",async()=>{
  const css=await readFile(new URL("../explorer.css",import.meta.url),"utf8");
  assert.ok(css.includes(".quick-nav-trigger{min-height:44px}"));
  assert.ok(css.includes(".quick-nav-close{width:44px;height:44px}"));
  assert.ok(css.includes(".quick-nav-search{min-height:44px}"));
});
