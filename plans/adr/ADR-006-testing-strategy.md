# ADR-006: Testing strategy — Vitest, data layer only

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** Wesley

## Context

We need a testing approach that gives confidence in the new persistence layer
without slowing development with brittle UI tests. The repositories
(`AdventureRepository`, `CharacterRepository`) and the `LocalStorageAdapter`
encapsulate non-trivial logic — id generation, migration of the legacy blob,
log append/edit semantics, image guardrails, quota errors — and are exactly
the kind of "deep module" worth protecting with tests.

Vue components in this codebase are thin: they bind props to inputs and call
update functions. Testing them adds maintenance cost without finding bugs the
repo tests would miss.

## Decision

- Adopt **Vitest** (native fit with Vite, no extra build config).
- Test the **deep modules**: `LocalStorageAdapter`, `AdventureRepository`,
  `CharacterRepository`, the legacy-blob migration, and any pure helpers
  (e.g. id generation, image downscale logic — the latter behind a stubbable
  seam).
- **Do not** test Vue components in this PRD's scope.
- Tests assert **external behavior only**: given inputs to the public API,
  verify the resulting persisted state and return values. No assertions
  about which storage keys were touched in what order, or other internals.
- Each test starts with a fresh in-memory `StorageAdapter` mock; the real
  `LocalStorageAdapter` has its own focused suite using `jsdom`'s
  `localStorage`.

## Consequences

- **Easier**: refactoring components is unconstrained; refactoring data shape
  is caught by tests.
- **Harder**: a UI regression in a complex component (e.g. the drawer
  interaction) won't be auto-detected. Acceptable trade-off given component
  thinness; we'll add component tests selectively if a component grows real
  logic.
- Must be true: any new persisted entity is added via a repository and ships
  with tests for the new public methods.
