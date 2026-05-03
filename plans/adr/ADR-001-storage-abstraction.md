# ADR-001: Storage abstraction via StorageAdapter + Repository

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** Wesley

## Context

The app currently calls `localStorage` directly from a Vue composable. The
adventure feature will introduce several new persisted entities (adventure
metadata, party member sheets, log entries, map images) and the user has
indicated that the storage backend should be easy to swap later (e.g. for
IndexedDB or a backend service). Direct `localStorage` calls scattered through
the codebase would make that swap painful and would also make testing the
business logic harder than it needs to be.

Options considered:

1. Keep direct `localStorage` calls inline in components/composables. Cheap
   today, costly to migrate later, hard to test.
2. A single `storage` utility wrapping `localStorage`. Better, but still mixes
   serialization, key naming, and entity logic in callers.
3. Two-layer split: a low-level `StorageAdapter` interface (key/value, async-
   ready) plus per-entity `Repository` modules that own key naming, schema
   shape, and validation. Components and composables only depend on
   repositories.

## Decision

Adopt option 3.

- `StorageAdapter` is a small interface with `get(key)`, `set(key, value)`,
  `remove(key)`, and `list(prefix)`. The current implementation is
  `LocalStorageAdapter`, which JSON-serializes values and swallows quota
  errors with a typed result. Methods return Promises so a future async
  backend (IndexedDB, HTTP) can be dropped in without changing callers.
- Repositories (`AdventureRepository`, `CharacterRepository`) consume an
  adapter and expose entity-shaped methods (e.g. `getCurrentAdventure()`,
  `appendLogEntry(entry)`, `saveCharacter(id, data)`).
- A single shared adapter instance is provided to the app (a thin DI seam — a
  module-level `defaultAdapter` that tests can override) so the swap point is
  one line.

## Consequences

- **Easier**: swapping the backend later, mocking storage in tests, enforcing
  key namespacing, and evolving entity schemas in one place.
- **Harder**: adds two layers of indirection for what is currently a one-line
  `localStorage.setItem`. Worth it because the surface area is about to grow.
- Must be true: every persisted feature goes through a repository — no
  component or composable calls `localStorage` directly.
