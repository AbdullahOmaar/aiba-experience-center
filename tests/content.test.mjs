import test from "node:test";
import assert from "node:assert/strict";
import { MODULES,JOURNEYS,FINANCIAL_CONCEPTS } from "../src/content.js";
test("the V1 module map contains exactly M01 through M08",()=>assert.deepEqual(MODULES.map(x=>x.id),["M01","M02","M03","M04","M05","M06","M07","M08"]));
test("module identifiers are unique and module content is bilingual",()=>{assert.equal(new Set(MODULES.map(x=>x.id)).size,MODULES.length);for(const m of MODULES)assert.ok(m.title.en&&m.title.ar&&m.description.en&&m.description.ar);});
test("every module has bilingual responsibilities",()=>{for(const m of MODULES){assert.ok(m.facets.length>0);for(const f of m.facets)assert.ok(f.every(v=>typeof v==="string"&&v.length>0));}});
test("AI is cross-cutting, not an additional ninth module",()=>{assert.equal(MODULES.length,8);assert.ok(!MODULES.some(x=>x.id==="M09"||x.key==="ai"));});
test("Accounting Core remains explicitly gated",()=>assert.equal(MODULES.find(x=>x.id==="M07").status,"gated"));
test("financial concepts stay distinct and contain no sample balances",()=>{const ids=FINANCIAL_CONCEPTS.map(x=>x.id);for(const id of ["invoice","payment","allocation","expense","cash","report"])assert.ok(ids.includes(id));assert.equal(new Set(ids).size,ids.length);for(const c of FINANCIAL_CONCEPTS)assert.ok(c.en&&c.ar&&c.enText&&c.arText&&!/\d/.test(c.enText));});
test("business concept maps are bilingual and structured",()=>{assert.ok(JOURNEYS.length>=3);for(const j of JOURNEYS){assert.ok(j.title.en&&j.title.ar&&j.steps.length>=3);for(const s of j.steps)assert.equal(s.length,4);}});
test("module visual positions are unique and statuses are explicit",()=>{const p=MODULES.map(x=>x.position.join(","));assert.equal(new Set(p).size,p.length);for(const m of MODULES)assert.ok(["scope","gated","dependent"].includes(m.status));});

test("sales journey and financial concepts cross-reference only matching explanatory steps",()=>{const sales=JOURNEYS.find(x=>x.id==="sales");assert.deepEqual(sales.stepConcepts,["invoice","payment","allocation","report"]);for(const c of FINANCIAL_CONCEPTS.filter(x=>x.journeyRef)){assert.equal(sales.stepConcepts[c.journeyRef.step],c.id);assert.equal(sales.steps.length>c.journeyRef.step,true);}});

test("module detail context links resolve only to existing journeys and financial concepts",()=>{for(const m of MODULES){if(m.journeyRef){const j=JOURNEYS.find(x=>x.id===m.journeyRef.id);assert.ok(j);assert.ok(m.journeyRef.step>=0&&m.journeyRef.step<j.steps.length);}for(const id of m.conceptRefs||[])assert.ok(FINANCIAL_CONCEPTS.some(c=>c.id===id));}});

test("module status labels distinguish charter scope from gated and source-dependent work",()=>{
  assert.deepEqual(MODULES.filter(x=>x.status==="scope").map(x=>x.id),["M01","M02","M03","M04","M05","M06"]);
  assert.equal(MODULES.find(x=>x.id==="M07").status,"gated");
  assert.match(MODULES.find(x=>x.id==="M07").short.en,/In V1 scope.*implementation gated/);
  assert.match(MODULES.find(x=>x.id==="M07").short.ar,/ضمن نطاق V1.*خاضع للاعتماد/);
  assert.equal(MODULES.find(x=>x.id==="M08").status,"dependent");
  assert.match(MODULES.find(x=>x.id==="M08").short.en,/In V1 scope.*source-dependent/);
  assert.match(MODULES.find(x=>x.id==="M08").short.ar,/ضمن نطاق V1.*مرتبط بالمصدر/);
});
test("financial concepts preserve invoice, payment, allocation and expense/cash boundaries",()=>{
  const byId=Object.fromEntries(FINANCIAL_CONCEPTS.map(x=>[x.id,x]));
  assert.match(byId.invoice.enDetail,/not evidence that the receivable has been collected/i);
  assert.match(byId.payment.enDetail,/separate recorded event/i);
  assert.match(byId.allocation.enDetail,/does not calculate or post/i);
  assert.match(byId.expense.enDetail,/does not by itself prove that cash has moved/i);
  assert.match(byId.cash.enDetail,/separate record/i);
});
