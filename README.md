# AIBA Experience Center (EXC)

Standalone, bilingual, interactive visual explainer for AI Business Assistant.

## What this is
EXC explains the verified Production V1 module map, module responsibilities, business concept relationships, financial distinctions, AI guardrails and security principles through interactive diagrams and motion-led visuals.

It is **not** a second ERP, marketing landing page, fictional demo, live workspace or operational tool. No fake business records or fabricated KPI values are shown.

## Boundaries
- Independent repository, source, build, dependencies and CI.
- No AIBA API, database, authentication, tenant session or shared imports.
- No network calls, external AI provider, analytics, tracking or live data in this version.
- Concept diagrams are explanatory; they do not execute business workflows.
- Financial concepts remain distinct. Accounting Core is marked gated; dependent financial reporting does not imply approved GL/posting behavior.
- AI remains a cross-cutting assistive layer; consequential actions require human approval.
- Module labels describe charter scope, not release availability.

## Stack
Static-first HTML, CSS and native JavaScript modules. No runtime dependencies, framework bundle or third-party graph package. Native SVG/CSS provides the graph language; semantic DOM controls provide keyboard-accessible interaction.

## Local development
Requires Node.js 22 or newer.
- npm test
- npm run validate
- npm run build

For local preview, run a static file server from the repository root.

## Language and accessibility
- English (LTR) and Arabic (RTL), switched in-place.
- Responsive layouts for desktop, tablet and mobile, including 320px narrow width.
- Keyboard-operable module/feature/flow controls with visible focus.
- Reduced-motion and forced-colors support.
- Semantic headings, buttons, links and live announcement regions.\n- Searchable module directory with bilingual text matching and scope/status filters; controls reflow for narrow mobile screens.\n- Source-grounded module relationship links with a touch-friendly detail panel; the map is explicitly explanatory and does not imply automatic synchronization.\n- Small-screen layouts replace the dense constellation graph with the searchable module directory as the primary exploration path.\n- Feature responsibilities include a step indicator and navigation to mapped related modules.

## Hosting
vercel.json configures a static deployment with restrictive response headers. Create a separate Vercel project only after the hosting owner approves the project mapping and domain. Do not add EXC to the AIBA Vercel project.

## Source authority
Module mapping and product boundaries follow the AIBA Production V1 ERP Charter and the canonical EXC Notion reference. A capability must not be labelled Available/Preview/Planned based on appearance alone; verify its source contract and implementation before making a release claim.
