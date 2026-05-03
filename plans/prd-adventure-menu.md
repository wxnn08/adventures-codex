# PRD — Adventure Menu (Left Drawer)

## Problem Statement

I'm playing a single ongoing D&D 5e adventure and the app today only knows
about my character sheet. Everything else about the campaign — the party I'm
playing with, the maps the DM has shared, the running log of what has
happened, and the adventure's basic identity (name, DM, setting) — lives in
my head, in scattered notes, or in a separate Discord channel. I want all of
that contextual information one click away, alongside my sheet, without
leaving the app.

## Solution

A collapsible left-side drawer dedicated to the **current adventure**. From
the drawer I can:

- Read and edit the adventure's name, DM, setting, start date, and notes.
- See my **party** as a list of full character sheets and click any party
  member to open their sheet in the main view.
- View a small **map gallery** of images the DM (or I) have uploaded, and
  open any map full-size.
- Read and append to an **adventure log** of session entries — append-only
  at the UI affordance, but each existing entry can be edited in place.

Switching between adventures is intentionally deferred; the data shape
supports it but the UI today shows a single adventure. The persistence layer
is abstracted behind a repository so the storage backend can change later
without touching UI code.

## User Stories

1. As a player, I want a collapsible left drawer, so that I can keep my full
   sheet visible most of the time and pull up adventure context only when I
   need it.
2. As a player, I want the drawer's open/closed state to persist across
   reloads, so that my preferred working layout is restored each session.
3. As a player, I want to set the adventure's **name**, so that I can
   identify the campaign at a glance.
4. As a player, I want to record the **DM's name**, **setting** (e.g. Forgotten
   Realms, homebrew), and **start date**, so that the adventure has the
   context I need months from now.
5. As a player, I want a freeform **adventure notes** field, so that I can
   capture lore, house rules summaries, or anything that doesn't fit the
   other fields.
6. As a player, I want to see a list of every character in my **party**, so
   that I know who I'm adventuring with.
7. As a player, I want each party entry to be a full character sheet, so
   that I can look up another PC's stats, spells, and equipment exactly the
   way I look up my own.
8. As a player, I want to add a new party member, so that when someone joins
   the table I can capture their character.
9. As a player, I want to remove a party member, so that when someone leaves
   the campaign their sheet doesn't clutter the list.
10. As a player, I want to mark which party member is **me**, so that the
    main sheet view defaults to my own character.
11. As a player, I want to click a party member and have the main view show
    their sheet, so that I can reference their character without losing my
    place.
12. As a player, I want to switch back to my own sheet with a single click,
    so that viewing another character is a low-friction detour.
13. As a player, I want to upload a **map image**, so that I can keep the
    DM's hand-outs in one place.
14. As a player, I want to label each map (e.g. "World", "Waterdeep",
    "Dungeon Level 2"), so that I can find the right one fast.
15. As a player, I want a **gallery** of maps, so that I can keep multiple
    handouts without overwriting older ones.
16. As a player, I want to open a map full-size in a viewer, so that I can
    actually read the labels.
17. As a player, I want to delete a map I no longer need, so that storage
    isn't wasted.
18. As a player, I want oversized images to be automatically downscaled at
    upload time, so that I don't accidentally fill localStorage and lose
    saved data.
19. As a player, I want a clear error when an upload would exceed storage,
    so that I understand why it failed instead of seeing silent loss.
20. As a player, I want an **adventure log** that lists session entries
    chronologically, so that I can re-read what happened last time before
    the next session.
21. As a player, I want to add a new log entry with an optional session
    number, optional in-game date, optional title, and a body, so that
    each entry carries the context I care about.
22. As a player, I want each entry timestamped at creation, so that I know
    when I wrote it.
23. As a player, I want to edit an existing log entry, so that I can fix
    typos or add details I forgot the first time without rewriting the
    whole log.
24. As a player, I want the entry list to clearly indicate when an entry
    was last updated (vs. created), so that I don't confuse a freshly
    edited entry with new history.
25. As a player, I want everything in the drawer to auto-save, so that I
    never have to remember to hit Save.
26. As a player, I want the data layout to support multiple adventures
    later, so that adding a switcher in a future release isn't a rewrite.
27. As a developer, I want all storage to flow through a `StorageAdapter`
    interface, so that swapping localStorage for IndexedDB or a backend is
    a single-implementation change.
28. As a developer, I want every persisted entity to be accessed via a
    repository, so that no component knows the storage key shape.
29. As a developer, I want the existing single-character localStorage blob
    migrated into the new keyspace on first load, so that early users
    don't lose their character when this ships.
30. As a developer, I want the data layer covered by tests, so that
    refactors and backend swaps are safe.

## Implementation Decisions

**New modules**

- `StorageAdapter` (interface) and `LocalStorageAdapter` (implementation):
  Promise-returning `get/set/remove/list`. Catches quota errors and returns
  a typed result rather than throwing silently. See ADR-001.
- `AdventureRepository`: owns the adventure record and exposes shaped
  methods — `getCurrent`, `updateMeta`, `addPartyMember`, `removePartyMember`,
  `setOwner`, `addMapImage`, `removeMapImage`, `renameMapImage`,
  `appendLogEntry`, `updateLogEntry`, `deleteLogEntry`. See ADR-002.
- `CharacterRepository`: owns character sheets keyed by uuid; exposes
  `create`, `get`, `update`, `remove`, `list`. Subsumes the existing
  single-character composable.
- `useAdventureDrawer` composable: reactive open/closed state, persisted
  via the same adapter under `ui:adventureDrawerOpen`. See ADR-003.
- `useCurrentCharacter` composable: resolves the actively-viewed character
  id, exposes the character record reactively and an `update()` patcher.
  Replaces today's `useCharacter('dnd5e-parchment-final')`.

**New / modified UI**

- `AdventureDrawer.vue` — left rail; contains collapsible sections for
  Adventure Identity, Party, Map Gallery, Adventure Log.
- Section components: `AdventureIdentity.vue`, `PartyList.vue`,
  `MapGallery.vue`, `AdventureLog.vue`, plus a `MapViewer.vue` modal and a
  `LogEntryEditor.vue`.
- `App.vue` is wrapped in a layout shell that renders the drawer + sheet
  side-by-side and toggles a sheet width class based on drawer state.
- A small "≡" toggle button is added to the existing toolbar to open/close
  the drawer; the same button collapses individual drawer sections.

**Data shape**

- Keys: `adventure:index`, `adventure:current`, `adventure:<id>`,
  `character:<id>`, `ui:adventureDrawerOpen`, `ui:viewingCharacterId`. See
  ADR-002.
- Adventure record: `{ id, name, dmName, setting, startDate, notes,
  ownerCharacterId, party: [{ characterId, role? }], mapGallery: [{ id,
  label, dataUrl, mime, bytes, addedAt }], log: [{ id, sessionNumber?,
  sessionDate?, createdAt, updatedAt, title?, body }] }`.
- Character record: unchanged shape from today's `blankCharacter()`, plus
  an `id` field.

**Migration**

- On first load, if `dnd5e-parchment-final` exists and `adventure:index`
  does not, generate ids, create one character record from the legacy
  blob, create one adventure record with that character as the sole party
  member and as `ownerCharacterId`, set `adventure:current`, and delete
  the legacy key. Migration runs once and is idempotent thereafter.

**Image guardrails (see ADR-005)**

- Reject raw uploads over a configurable byte ceiling.
- Downscale any image with a longest edge over 2048px to JPEG q=0.85 via
  `<canvas>`.
- Surface `QuotaExceeded` from the adapter as a user-facing error, not a
  silent failure.

**Drawer interaction (see ADR-003)**

- Push layout, fixed 280px column. Sheet container reacts to drawer state.
- Default closed; open/closed state persisted.
- Internally scrollable. Mobile responsive polish out of scope.

## Testing Decisions

A good test in this codebase asserts **external behavior** of the deep data
modules — given calls to a repository's public methods, the resulting
persisted state and return values are correct. Tests do not assert which
storage keys were written, in what order, or any other implementation detail
that a reasonable refactor would change.

Modules with test coverage in this PRD's scope:

- `LocalStorageAdapter` — round-trip get/set/remove, missing-key behavior,
  JSON safety on bad input, `list(prefix)` correctness, `QuotaExceeded`
  result on overflow.
- `AdventureRepository` — full CRUD on adventure meta, party, map gallery,
  and log; legacy migration; ownerCharacterId invariants.
- `CharacterRepository` — create with generated id, update by id, remove,
  list; immutability of stored copies.
- Pure helpers (id generation seam, image-downscale boundary cases through
  a stubbed canvas).

Vue components are explicitly **not** tested in this PRD; their logic is
thin and is covered indirectly by repository tests. See ADR-006.

Prior art: there are no existing tests in this repo. Vitest is the natural
choice (matches Vite, zero extra build config). Tests live in `*.test.js`
files colocated with the module under test.

## Out of Scope

- Multiple adventures and an adventure switcher UI (data shape supports it;
  UI is deferred).
- NPCs, Quests, Locations, Factions, Session Notes, In-game Calendar, Loot
  Pool, House Rules, DM info — explicitly deferred per user direction
  ("keep simple for now").
- Mobile / narrow-viewport polish for the drawer.
- Backend / multi-device sync. The storage abstraction makes this possible
  later but no backend work is in this PRD.
- Sharing or exporting an adventure to other players.
- Image markers / pinning on maps.
- Rich-text formatting in log entries beyond plain text/newlines.
- Component-level UI tests.

## Further Notes

- **Why a repository per entity, not one mega-store?** Each repository owns
  one schema and one set of invariants (e.g. ownership, log timestamps).
  Splitting them keeps each module deep and testable; combining them would
  mix concerns and make the migration story harder.
- **Why Promises in the adapter when localStorage is sync?** Adopting an
  async signature now means swapping in IndexedDB or HTTP later does not
  ripple through every caller.
- **Why a "current adventure" pointer instead of a hardcoded key?** It is
  the smallest amount of structure that makes the eventual switcher a UI
  change, not a data migration.
- **Why migrate the legacy blob on first load?** Existing local users
  (just me, today) shouldn't see their character disappear when this
  ships. The migration is small and runs exactly once.
