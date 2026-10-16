# Koofy Image — web + mobile handoff

Owner decision (2026-10-16): free utility to increase repeat visits to the Koofy website, not a reader-specific funnel. No signup, payments, ads, AI, image uploads, or cloud storage in v1. Git push and deployment are performed by the owner.

## Product contract

- Route `/koofy-image`, within Quiz_Site. Future iOS/Android app uses a separate Flutter repository, one codebase for both OSes.
- Core jobs: iPhone HEIC/HEIF → common format; reduce high-resolution phone photo size for sharing/blog uploads.
- Inputs JPG/JPEG, PNG, static WebP, HEIC/HEIF. Outputs JPG, PNG, WebP. HEIC first still only; no Live Photo video. No animation, SVG, PSD, or HEIC output.
- Maximum 10 files, 25 MiB per file, 100 MiB total. Decode limit 40 million pixels and 16,384 px per edge; browser decoder may allocate before validation. 10 is a batch cap, not a memory guarantee. Process sequentially, free canvas/object URLs.
- No original overwrite. Download individually or ZIP; names sanitized, collision-safe. Filename changes extension to actual output MIME. App variants should additionally use native share/save flows.
- Conversion defaults: JPG, quality 85%, original width, white alpha background. Compression defaults: 1024 KiB target per file; allow proportional downscaling after quality search. Width is maximum width (not longest edge), never upscale.
- Search quality at fixed dimensions first, up to 6 attempts per scale and up to 7 scale passes. PNG has no quality-based savings; downscale only if allowed. Target misses must be labeled, never claimed successful.
- Quality, EXIF orientation, alpha, color/HDR, HEIC first still, filename collisions and target misses are behavioral requirements across platforms, not a promise of byte-identical output. Output removes metadata; professional color/HDR fidelity is outside scope.
- Save preferences locally only; never save filenames/photos/results in localStorage. Clear photos on reload. Warn before unload for active jobs or undownloaded results. Cancellation may finish current native/HEIC codec work but discards that result and stops the queue.
- File extension validates basic eligibility; content decode still determines support. Corrupted files fail independently. Animated WebP/APNG rejected rather than silently flattened.

## UX behavior (2026-10-16 patch)

- Compact introduction, selected count and total input size. Show the first 3 filenames by default; allow expanding all 10 in a bounded, keyboard-scrollable list.
- Explain JPG/PNG/WebP use beside the output selector. For JPEG, warn about transparent pixels and link directly to the alpha background control. Detection uses the preview; this is a convenience hint, not a full-resolution alpha guarantee.
- Compression presets: 200/500/1024/2048 KiB, plus a custom input shown only when selected. Custom width likewise appears only when chosen.
- Keep the settings snapshot for each result. Meaningful changes mark old outputs and offer reconversion; switching back clears the marker. Ignore inactive target/resize options in format-only mode and inactive quality/background controls for PNG. Never silently re-encode an existing result.
- On completion, announce completed/failed/cancelled counts and move focus/scroll to results, respecting reduced motion. Per-file badges distinguish target met, over target, and larger output.
- Mobile has a bottom action bar during the work/results area: convert, cancel while processing, or ZIP save after completion. Changed settings or pending photos restore the convert action. Hide it for comparison and after the work/results area is out of view.

## Architecture / sources of truth

- `lib/image-tools/rules.ts`: limits, settings validation, naming, dimensions (portable to mobile).
- `lib/image-tools/convert.ts`: web implementation. `components/image-tools/ImageTool.tsx`: queue/downloads/state. CSS module: isolated design.
- `docs/koofy-image/open-source.md`: dependency/licensing rationale.
- `docs/koofy-image/verification.md`: actual checks and outstanding device tests, update after each change.
- UI starts in Korean on this route; Korean and English tool copy, other site languages currently fall back to English explicitly via `lang=en`. Full JA/ZH tool translation is future work; do not claim it exists.

## Mobile agent bootstrap (copy into future AGENTS.md)

Read this specification and open-source/verification documents before implementation. Preserve the free/offline/no-image-upload model, maximum 10 images, target-miss disclosure, metadata removal, alpha background selection, EXIF orientation and per-file errors. Use native HEIC decoding when suitable rather than assuming web JS libraries work in Flutter. Add photo selection, save-to-files/photos and share-sheet integration. Do not copy the reader's book/ad features. Validate app photo permissions and library licenses per platform. Test real iPhone HEIC/HDR/rotation and Galaxy photos. Do not claim browser validation proves native behavior. Deployment/release actions belong to the owner unless separately authorized.

## Follow-up choices

Native app icon/bundle IDs/store metadata and monetization are not selected. Check hosting plan eligibility/limits before publishing; browser processing removes conversion compute/storage, not page-transfer costs. No automatic deploy.
