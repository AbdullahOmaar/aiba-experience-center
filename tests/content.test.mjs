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
