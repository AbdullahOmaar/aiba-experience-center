# EXC Architecture Decision Record — ADR-EXC-001

- Status: Proposed implementation baseline; Product Owner readback still required.
- Date: 2026-11-13
- Scope: Initial public explanatory experience only.
- Decision owner: Project Master / implementation owner.

## Context
EXC is a separate interactive graphical explainer. It must not become a second ERP, a fictional demo, or an application coupled to AIBA runtime data. The first release is public and explanatory.

## Decision
Use a dependency-free static application:
- Semantic HTML for document structure.
- CSS for responsive layout, interaction states and purposeful motion.
- Native JavaScript ES modules for curated content and interactions.
- SVG for the interactive module relationship map.
- Node.js 22 built-in test runner and validation scripts.
- Independent GitHub Actions validation and static Vercel deployment.

## Rationale
- No API, database, authentication or tenant runtime is needed.
- Avoids external graph, animation and UI dependencies in the initial release.
- Reduces runtime surface and supply-chain exposure.
- Native DOM controls retain keyboard semantics and work on mobile.
- Static hosting can be deployed independently from the AIBA Angular/FastAPI/PostgreSQL application.

## Non-goals
- No live data, synthetic operational records, fake KPIs or tenant simulation.
- No CRUD, AI chat, model calls or consequential actions.
- No direct integration with the AIBA application runtime.
- No authenticated session, SSO, shared token or browser-storage coupling.

## Consequences and controls
- Module and feature content must remain source-grounded.
- Scope labels must not be mistaken for release availability.
- Arabic and English share one content model and state.
- Motion respects prefers-reduced-motion.
- The application must remain useful on small screens and with keyboard navigation.
- Future backend, AI, SSO, analytics or live-data needs require a new security/architecture decision and explicit work order.
