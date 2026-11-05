# Quiz_Site working notes

This is the existing Koofy public website and admin application. Preserve unrelated routes, admin behavior, and the established language provider. The owner handles Git push and deployment; do not publish without explicit authorization.

## Koofy Image

Before modifying `/koofy-image`, read `docs/koofy-image/README.md`, `open-source.md`, and `verification.md`. Keep image processing local to the browser. Do not introduce uploads, cloud image storage, AI APIs, signup, payments, or ads without a product decision. Enforce 10 files per batch and the documented memory limits; process sequentially. Preserve MIME/extension correctness, target-miss labels, transparent-image handling, rotation, metadata removal, and independent per-file errors. Keep codec versions, local vendor assets, and license/source notices synchronized.

For a future mobile repository, carry over the behavioral contract and verification gaps in those documents; native photo selection/save/share and codecs require independent validation.

Checks: `npm run test:image-tools`, `npx tsc --noEmit`, `npm run build`. Use real browser conversions/downloads as well as pure rule tests. Do not equate responsive Chrome checks with iOS Safari validation.

## Reader admin reuse

- Reuse shared components for repeated admin UI and utilities for repeated domain logic; menu pages compose them rather than copying implementations.
- General-book serials and serial novels use the same `WorkEditor` and `UnifiedWorkEpisodes` detail screen. Choose episode UI by `kind`, never by `collectionType` or the entry menu. Keep monthly-only publishing/compilation rules separate.
- All episode batch editors provide scheduled publishing, regardless of collection/category. Use `ReaderPublicationSchedule` and `ReaderReleaseDateField` for Korean-time schedule controls and `work-schedule.ts` for schedule assignment/validation.
- Use `collectEpisodePages` for complete episode pagination and `entryStatus`/`ReaderStatus` for saved-versus-published status. Do not silently return partial lists or show draft schedules as live publication status.
- Preserve uploaded content, IDs, published snapshots, language-specific files, retry checkpoints and existing permission checks during refactoring.
