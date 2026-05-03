# ADR-003: Drawer interaction model — push, default closed, persisted state

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** Wesley

## Context

The adventure menu is a left-side drawer. We must choose:

1. Push (sheet shifts right when drawer opens) vs overlay (drawer floats above
   the sheet).
2. Default open or default closed on first load.
3. Whether to remember the user's last open/closed state across reloads.

The character sheet is the primary content and is wide (max-width 1280px). An
overlay would obscure it; a push keeps everything visible at the cost of some
horizontal space when the drawer is open.

## Decision

- **Push** layout. Drawer occupies a fixed 280px column on the left when open;
  the sheet container shrinks accordingly within the existing max-width.
- **Default closed** on first load — the sheet is the focus, the menu is
  contextual.
- **Persist open/closed** state under `ui:adventureDrawerOpen` so the drawer
  re-opens to the user's last state.
- The drawer is itself **internally scrollable** — its sections (Party, Map,
  Log, etc.) can grow without affecting page scroll.
- Mobile / narrow viewport behavior is **out of scope for this PRD**; on small
  screens the drawer falls back to overlay-style behavior using the same
  component, but no responsive polish is in scope here.

## Consequences

- **Easier**: full visibility of both menu and sheet; predictable layout.
- **Harder**: on narrower laptops the sheet is squeezed when the drawer is
  open. Acceptable since the user controls the toggle.
- Must be true: the sheet's outer container reacts to drawer state via a
  shared store/composable, not via prop drilling from a single ancestor.
