import { readFile } from "node:fs/promises";

const read = path => readFile(new URL("../" + path, import.meta.url), "utf8");
const [html, app, quickNav, mobileNav, searchNormalizer, styles, explorerStyles, vercelText, packageText] = await Promise.all([
  read("index.html"),
  read("src/app.js"),
  read("src/quick-nav.js"),
  read("src/mobile-nav.js"),
  read("src/search-normalization.js"),
  read("styles.css"),
  read("explorer.css"),
  read("vercel.json"),
  read("package.json")
]);

const ids = [...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]);
const idSet = new Set(ids);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) throw new Error("Duplicate HTML IDs: " + duplicateIds.join(", "));

const requiredIds = [
  "main", "top", "modules", "module-graph", "graph-nodes", "module-explorer",
  "module-detail", "module-grid", "features", "feature-list", "feature-explanation",
  "journeys", "journey-tabs", "journey-stage", "financial-concepts", "financial-map",
  "ai", "trust", "final-entry", "mobile-section-nav", "quick-nav-dialog",
  "quick-nav-open", "quick-nav-search", "quick-nav-results", "quick-nav-count", "quick-nav-status"
];
const missingIds = requiredIds.filter(id => !idSet.has(id));
if (missingIds.length) throw new Error("Missing app anchors: " + missingIds.join(", "));

const mobileNavBlock = html.match(/<nav class="mobile-section-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
if (!mobileNavBlock) throw new Error("Mobile section navigation markup missing.");
const mobileTargets = [...mobileNavBlock.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
const missingMobileTargets = mobileTargets.filter(id => !idSet.has(id));
if (missingMobileTargets.length) throw new Error("Broken mobile navigation targets: " + missingMobileTargets.join(", "));
if (mobileTargets.length !== 10) throw new Error("Mobile navigation must expose all ten story sections.");

const quickTargets = [...quickNav.matchAll(/\{id:"([^"]+)",key:"section/g)].map(match => match[1]);
const missingQuickTargets = quickTargets.filter(id => !idSet.has(id));
if (missingQuickTargets.length) throw new Error("Broken quick-navigation targets: " + missingQuickTargets.join(", "));
if (quickTargets.length < 10) throw new Error("Quick navigation section catalogue is incomplete.");

if (!html.includes('role="combobox"') ||
    !html.includes('aria-controls="quick-nav-results"') ||
    !html.includes('id="quick-nav-results" role="listbox"') ||
    !html.includes('id="quick-nav-status" aria-live="polite"')) {
  throw new Error("Quick navigation combobox/listbox/live-region markup is incomplete.");
}
if (!quickNav.includes('input.setAttribute("aria-activedescendant"') ||
    !quickNav.includes("function focusDestination(") ||
    !quickNav.includes("destinationOwnsFocus=true")) {
  throw new Error("Quick-navigation keyboard/focus handoff is incomplete.");
}
if (!quickNav.includes("currentItems=matches;") ||
    !quickNav.includes('button.setAttribute("aria-posinset"') ||
    !quickNav.includes('button.setAttribute("aria-setsize"')) {
  throw new Error("Quick-navigation result discovery metadata is incomplete.");
}

if (!app.includes('document.documentElement.dir=state.lang==="ar"?"rtl":"ltr"')) {
  throw new Error("RTL/LTR handling missing.");
}
if (!styles.includes("@media(prefers-reduced-motion:reduce)") ||
    !styles.includes("@media(forced-colors:active)") ||
    !styles.includes(".mobile-section-nav") ||
    !explorerStyles.includes(".quick-nav-option") ||
    !explorerStyles.includes(".quick-nav-dialog")) {
  throw new Error("Responsive/accessibility CSS is incomplete.");
}
if (!mobileNav.includes("IntersectionObserver") ||
    !mobileNav.includes('aria-current","location"') ||
    !mobileNav.includes("nav.getClientRects().length") ||
    !mobileNav.includes("const focusSection=id=>") ||
    !mobileNav.includes("focusSection(id)") ||
    !mobileNav.includes('heading.focus({preventScroll:true})')) {
  throw new Error("Mobile scroll-spy, visibility guard or focus handoff is incomplete.");
}
if (!html.includes('aria-keyshortcuts="Control+K Meta+K /"')) {
  throw new Error("Quick-navigation keyboard shortcut semantics are missing.");
}
if (!explorerStyles.includes("@media(max-height:560px)") ||
    !explorerStyles.includes("@media(max-height:440px) and (max-width:760px)") ||
    !explorerStyles.includes("@media(max-height:360px) and (max-width:760px)")) {
  throw new Error("Short-viewport Quick Navigation layouts are incomplete.");
}
if (!searchNormalizer.includes(String.raw`[\u0300-\u036f]`) ||
    !searchNormalizer.includes(String.raw`[\u064b-\u065f\u0670\u0640]`)) {
  throw new Error("Bilingual search normalization ranges are incomplete.");
}

const applicationSource = app + quickNav + mobileNav + searchNormalizer;
if (/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b/i.test(applicationSource)) {
  throw new Error("Live network/API or browser-storage coupling is not allowed.");
}
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) {
  throw new Error("Inline scripts are not allowed in the standalone EXC document.");
}

const vercel = JSON.parse(vercelText);
const csp = vercel.headers?.flatMap(entry => entry.headers ?? []).find(header => header.key === "Content-Security-Policy")?.value ?? "";
if (!csp.includes("connect-src 'none'") || !csp.includes("frame-ancestors 'none'")) {
  throw new Error("Standalone Content-Security-Policy boundary is incomplete.");
}

const pkg = JSON.parse(packageText);
if (pkg.dependencies || pkg.devDependencies) {
  throw new Error("Initial EXC baseline must remain dependency-free.");
}

console.log(
  "Static validation passed: " +
  requiredIds.length + " required anchors, " +
  mobileTargets.length + " mobile destinations, " +
  quickTargets.length + " quick-navigation destinations, " +
  "unique IDs, bilingual direction, responsive/accessibility source, no API/storage coupling, CSP and dependency-free package."
);
