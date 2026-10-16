# Quiz_Site working notes

This is the existing Koofy public website and admin application. Preserve unrelated routes, admin behavior, and the established language provider. The owner handles Git push and deployment; do not publish without explicit authorization.

## Koofy Image

Before modifying `/koofy-image`, read `docs/koofy-image/README.md`, `open-source.md`, and `verification.md`. Keep image processing local to the browser. Do not introduce uploads, cloud image storage, AI APIs, signup, payments, or ads without a product decision. Enforce 10 files per batch and the documented memory limits; process sequentially. Preserve MIME/extension correctness, target-miss labels, transparent-image handling, rotation, metadata removal, and independent per-file errors. Keep codec versions, local vendor assets, and license/source notices synchronized.

For a future mobile repository, carry over the behavioral contract and verification gaps in those documents; native photo selection/save/share and codecs require independent validation.

Checks: `npm run test:image-tools`, `npx tsc --noEmit`, `npm run build`. Use real browser conversions/downloads as well as pure rule tests. Do not equate responsive Chrome checks with iOS Safari validation.
