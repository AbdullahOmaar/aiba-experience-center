import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSearchText } from "../src/search-normalization.js";

test("Arabic search ignores harakat and tatweel",()=>{
  assert.equal(normalizeSearchText("مُـدِير"),normalizeSearchText("مدير"));
});
test("Arabic search normalizes common alef and ya variants",()=>{
  assert.equal(normalizeSearchText("إدارة"),normalizeSearchText("ادارة"));
  assert.equal(normalizeSearchText("على"),normalizeSearchText("علي"));
});
test("Latin search ignores combining accents and letter case",()=>{
  assert.equal(normalizeSearchText("Café"),normalizeSearchText("cafe"));
});
