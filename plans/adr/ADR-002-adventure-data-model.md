# ADR-002: Adventure data model — single record, multi-ready shape

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** Wesley

## Context

The product today supports a single adventure. The user has stated that
multi-adventure support is a deferred goal but should not require a data
migration when it lands. We need a shape that:

- Stores one adventure cleanly today.
- Can grow to N adventures without rewriting the repository or migrating
  existing data.
- Tracks which adventure is "current" so the rest of the UI (character sheet,
  party, etc.) knows what to display.

## Decision

Persist adventures keyed by id, plus a pointer to the current one. Even with
one adventure today, the storage layout looks like this:

- `adventure:index` — array of adventure ids.
- `adventure:<id>` — the adventure record.
- `adventure:current` — the id of the currently active adventure.

The adventure record contains:

- Identity: `id`, `name`, `dmName`, `setting`, `startDate`, `notes`.
- Party: array of party-member references (`{ characterId, role? }`). Full
  character sheets live in their own keys (see ADR-004).
- Map gallery: array of `{ id, label, dataUrl, addedAt }`.
- Log: array of `{ id, sessionNumber?, sessionDate?, createdAt, updatedAt,
  title?, body }`. Append-only at the UI level; entries are editable in place.

Today the index has exactly one id; the multi-adventure switcher is a future
UI on top of the same shape.

## Consequences

- **Easier**: future "switch adventure" feature becomes a UI change on an
  already-correct data shape.
- **Easier**: each adventure can be exported/imported as a single record.
- **Harder**: today's UI must read `adventure:current` to find the active
  record rather than a single hardcoded key.
- Must be true: anywhere we read "the adventure", we go through
  `AdventureRepository.getCurrent()`, never a fixed key.
