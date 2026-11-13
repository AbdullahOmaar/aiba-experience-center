# EXC responsive UX matrix — source-level specification

This document records the responsive behavior present in the standalone source. It is a code-level inventory, **not** evidence of rendered-device acceptance.

## Layout and navigation

| Width / condition | Source behavior | UX intent |
| --- | --- | --- |
| Above 1040px | Full desktop navigation and header actions remain available. | Wide cinematic composition and direct section navigation. |
| At or below 1040px | Compact header treatment; keyboard shortcut hint may be hidden when space is constrained. | Preserve navigation without crowding the header. |
| At or below 1020px | Ten-destination mobile/tablet section rail and expanded touch-target rules are active. | Persistent access to every story section on touch devices. |
| At or below 760px | Main content shifts to phone-oriented single-column and stacked layouts; graph discovery yields to the searchable module directory. | Prioritize readable content and direct touch exploration. |
| At or below 560px | Quick Navigation result cards reflow their type label beneath the destination text. | Give Arabic and English destination names more usable width. |
| At or below 380px | Narrow-phone refinements reduce secondary spacing while preserving minimum touch sizing. | Keep core actions usable on compact phones. |
| At or below 360px height and 760px width | Quick Navigation uses a compact short-viewport layout. | Keep close/search controls reachable in constrained landscape or short screens. |

## Interaction and accessibility contracts

- The document direction switches between English LTR and Arabic RTL from the selected language.
- Mobile section navigation uses native anchors; the active section is reflected with `aria-current="location"` when the scroll observer is available.
- Compact-header navigation and primary interactive controls use 44px minimum touch sizing where defined by the source styles.
- The exploration trail reflows to four columns on compact screens rather than compressing eight steps into a single row.
- Quick Navigation supports a bounded dialog viewport, scrollable results, keyboard movement and focus return.
- Reduced-motion and forced-colors media rules are present in the authored styles.
- Normal document scrolling is retained; the experience does not depend on forced scroll pinning.

## Verification status

- **Source inspection:** present for the breakpoints and interaction contracts listed above.
- **Rendered phone/tablet/desktop checks:** NOT RUN.
- **RTL/LTR visual review:** NOT RUN.
- **Screen-reader and real touch-device acceptance:** NOT RUN.

Do not convert these source-level checks into a claim that AC-13/AC-14 have passed on real devices. Revisit this matrix after rendered browser/device verification.
