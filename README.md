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
- Semantic headings, buttons, links and live announcement regions.
- Module universe graph and module explorer are separate guided sections; graph selection moves the visitor to detailed module responsibilities.
- Searchable module directory with bilingual text matching and scope/status filters; controls reflow for narrow mobile screens.
- In-session module exploration trail with an accessible progress indicator and direct module shortcuts; progress is intentionally not persisted or sent to a server.
- Guided module tour advances through unvisited modules in charter order, offers a restart after all eight are explored, and keeps progress session-only.
- The module relationship graph supports directional keyboard navigation, Home/End shortcuts and focus handoff while preserving the same module selection behavior as pointer interaction.
- Source-grounded module relationship links with a touch-friendly detail panel; the map is explicitly explanatory and does not imply automatic synchronization.
- Small-screen layouts replace the dense constellation graph with the searchable module directory as the primary exploration path.
- A dedicated business transformation story section explains the product narrative from separate business responsibilities to a clearer connected view without showing live records or implying automatic synchronization.
- Feature responsibilities include a step indicator and navigation to mapped related modules. Module detail panels also link into their mapped explanatory business-flow steps and financial concepts where the approved content defines a relationship; no operational behavior is implied.
- Business journey tabs and their individual steps support keyboard navigation, accessible tab/tabpanel relationships and RTL-aware arrow keys; each journey has step progress, previous/next touch controls and step-specific module shortcuts that change with the selected concept step. Previous/next controls return focus after updating the step.
- Financial concepts are selectable and reveal a focused boundary explanation without calculations, posting or settlement logic. Invoice, payment, allocation and reporting steps cross-link to their matching financial concepts and back to the explanatory sales journey step; no posting or settlement behavior is implied.
- AI capability and Trust principle maps are keyboard/touch selectable and reveal source-grounded explanations; no AI API or live audit/security view is exposed.
- Module exploration progress is tracked only in the current page session, with no browser storage or server-side persistence.

## Mobile navigation
- On phones, a persistent horizontal section rail keeps the main destinations reachable without relying on the desktop menu.
- The active section is indicated as the visitor scrolls; links remain native in-page anchors and work without JavaScript.
- The rail supports touch scrolling, RTL layout, keyboard focus, reduced motion and forced-colors. It does not store navigation history or contact a service.

## Global quick navigation
- Open the bilingual command palette from the header, with `Ctrl/⌘ + K`, or press `/` outside text-entry controls.
- Search modules, individual responsibilities, explanatory journeys, financial concepts and page sections in Arabic or English. Search normalization ignores common Arabic diacritics/tatweel and common alef/ya variants, plus Latin accent marks. Selecting a financial concept opens its boundary explanation without executing any financial behavior.
- Navigate results with arrow keys, Home/End, Page Up/Down and Enter; the search input exposes combobox/listbox semantics and the active option to assistive technology. Result counts and empty states are announced in English or Arabic. Escape closes the native modal dialog and returns focus.
- The palette is client-only and does not persist search history or contact a service.

## Hosting
vercel.json configures a static deployment with restrictive response headers. Create a separate Vercel project only after the hosting owner approves the project mapping and domain. Do not add EXC to the AIBA Vercel project.

## Source authority
Module mapping and product boundaries follow the AIBA Production V1 ERP Charter and the canonical EXC Notion reference. A capability must not be labelled Available/Preview/Planned based on appearance alone; verify its source contract and implementation before making a release claim.
