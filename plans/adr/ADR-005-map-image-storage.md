# ADR-005: Map images stored as base64 with size guardrails

**Status:** Accepted
**Date:** 2026-05-02
**Deciders:** Wesley

## Context

The adventure includes a small gallery of map images. The product is
localStorage-backed today. localStorage typically caps at ~5–10MB per origin
and stores strings only, so images must be encoded as data URLs (base64) and
kept small. Without guardrails, a single 4K screenshot can blow the quota and
cause silent save failures.

## Decision

- Map images are stored as base64 data URLs on the adventure record under
  `mapGallery: [{ id, label, dataUrl, mime, bytes, addedAt }]`.
- On upload, the client:
  - Rejects files over a configurable byte ceiling (default 1.5MB raw).
  - Downscales any image whose longest edge exceeds 2048px through a
    `<canvas>` resize, re-encoded as JPEG quality 0.85.
  - Surfaces an explicit error when the resulting payload would exceed the
    remaining storage budget.
- Storage budget tracking is the `StorageAdapter`'s responsibility; quota
  errors from `setItem` are caught and returned as a typed `QuotaExceeded`
  result, never thrown silently.
- The repository exposes `addMapImage(file)`, `removeMapImage(id)`, and
  `renameMapImage(id, label)` — components do not handle file → base64
  themselves.

## Consequences

- **Easier**: image handling is centralized; future migration to a blob store
  (IndexedDB, S3) replaces the encoder, not every caller.
- **Easier**: quota issues surface as actionable errors instead of silent
  data loss.
- **Harder**: image quality is capped and uploads can be rejected.
  Acceptable: the alternative is data loss.
- Must be true: no component bypasses the repository to write images
  directly.
