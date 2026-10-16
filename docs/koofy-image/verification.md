# Verification — 2026-10-16

## Passed

- `npm run test:image-tools`: 4 tests cover supported/unsupported/empty/oversized input, aspect-ratio/no-upscale rules, filename collision/path sanitization, and untrusted saved preferences.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed; 56 generated pages. Only two pre-existing no-img-element warnings in result/PopularTests. Koofy Image first-load JS ~150 kB (Next report, not full measured transfer).
- Chrome production preview at 127.0.0.1:3087: JPG/PNG/HEIC/EXIF-rotated JPEG mixed input. HEIC sample is libheif 1.22.2 examples/example.heic from official source archive.
- Ordinary conversion to JPG: 4 valid inputs completed, broken.jpg failed independently. Original source dimensions 2400×1600, 900×700, 600×400 after EXIF orientation, 1280×854 HEIC. Aggregate 4.95 MiB → 2.43 MiB for those samples.
- Downloaded ZIP opened with Python zipfile/Pillow: 4 entries, each actual JPEG and correct dimensions; output EXIF empty. Transparent PNG → JPEG corner is white (255,255,255).
- Input 11 unique files: accepted 10, warning shown, all 10 converted in sequence.
- Target 500 KiB JPEG: noise photo 4.26 MiB → 492.0 KiB, dimensions 2400×1600 → 2040×1360. HEIC →344.2 KiB. All 3 tested outputs ≤target.
- Target 10 KiB with resizing disabled: photo and HEIC retain dimensions and clearly display target-missed warning; small transparent image is within target.
- Native-canvas WebP conversion: 3 inputs complete, actual downloaded WebP opens as RGBA, transparent corner alpha 0.
- PNG conversion: 3 inputs complete; downloaded transparent PNG retains alpha 0. Output may grow vs JPEG/HEIC and aggregate explicitly reports growth.
- Comparison dialog opens/closes and returns focus. Saved settings restored on page reload.
- Responsive Chrome width override 390 px: vertical layout and no horizontal overflow (375 px client/scroll width excluding scrollbar). This is not an iOS device test.
- Source code uses no image-upload endpoint. Local worker/module/WASM assets are served by this website; file content is never submitted to a server by the converter. No filenames/photos stored in localStorage.

## Final change and verification boundary

Small thumbnails are generated sequentially; full images are shown only in comparison. After this change, type check and production build were rerun and mixed conversion was rechecked in Chrome. Decode itself still depends on browser memory limits; a 40 MP input limit is not an assurance that every device can process it.

## Outstanding before claiming broad device support

- macOS Safari could not be launched through computer-use (timeout). Safari/iPhone real HEIC/HDR/color behavior, WebP WASM fallback, and native download/share behavior remain unverified.
- Android real-device memory behavior, 10 near-limit photos, complete EXIF orientation matrix, wide-gamut/HDR fixtures, unusual HEIC collections, and APNG/animated WebP fixtures need further checks.
- Cancellation/error-retry logic is implemented, but cancellation during HEIC decoding and ZIP failure were not exercised end-to-end. HEIC/native encode cannot instantly abort; completed result is discarded and queue stops.
- Drag/drop is implemented; file-picker path is tested. Native desktop file drag was not exercised.
- Do not describe the tool as a professional color-managed editor or promise lossless target-size conversion.

## Dependencies

fflate 0.8.2 was replaced with 0.8.3 after audit found GHSA-px8p-9vwx-vf98 (unzipSync malformed ZIP64; Koofy only creates ZIPs). The baseline repository has other existing npm advisories, not fixed via unrelated major upgrades here. Recheck the full repository separately before treating it as audited.

## Release

No Git push, Vercel deployment, mobile project creation, or app-store release was performed. The owner handles deployment. Public route will be `/koofy-image` after deployment.
