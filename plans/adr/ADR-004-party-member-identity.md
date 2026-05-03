# ADR-004: Party members are full character sheets

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** Wesley

## Context

A party member could be modeled two ways:

1. A lightweight roster card (name, class, level, notes) stored on the
   adventure itself.
2. A full character sheet, identical in shape to the player's own sheet,
   stored independently and referenced by id from the adventure.

The user explicitly chose option 2: clicking a party member opens their full
sheet.

This forces several follow-on decisions: how characters are identified, how
the player's own character relates to other party members, and how switching
"which sheet I am viewing" works.

## Decision

- Every character — the player's own and every party member — is stored under
  `character:<id>`, where `id` is a stable UUID generated at creation.
- The adventure references party members via
  `party: [{ characterId, role? }, ...]`.
- The player's own character is one of the party entries; a flag
  `ownerCharacterId` on the adventure marks which member is "you". On first
  run a default character is created and set as the owner; the existing
  legacy `dnd5e-parchment-final` blob is migrated into a new
  `character:<id>` entry on first load.
- The currently-viewed character id is stored under `ui:viewingCharacterId`
  and defaults to `ownerCharacterId`. The character sheet component reads
  from this id, not from a hardcoded key.

## Consequences

- **Easier**: no special case for "my character vs other characters"; one
  schema, one repository.
- **Easier**: future features like "swap to controlling an NPC" or
  "co-op edit a friend's sheet" reuse the same plumbing.
- **Harder**: a one-time migration is required to lift the existing single-
  character blob into the new keyspace.
- Must be true: the character-sheet UI never assumes a fixed key; it always
  resolves the active character via the repository.
