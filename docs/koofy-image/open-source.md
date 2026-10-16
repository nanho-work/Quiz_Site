# Open-source decisions

- browser-image-compression 2.0.2 (MIT): JPEG/PNG encoding and worker option. Its size-target algorithm is not blindly used: Koofy owns the target/resize policy. Worker imports point to our own origin rather than the package's CDN default.
- heic-to 1.5.2 (LGPL-3.0-or-later): only on HEIC input. Unmodified CSP build kept in public/vendor, outside the app bundle so it can be independently replaced. Upstream states libheif 1.22.2; published build instructions pin libde265 1.0.16. Exact upstream sources and full GPL/LGPL notices are offered as downloads. No proprietary HEIC service or image uploads. Future native app must reassess linking/distribution obligations.
- @jsquash/webp 1.5.0 (Apache-2.0 and codec BSD notice): only used if canvas cannot encode WebP. Serve WASM locally. Existing browser encoding preferred. Full codec source upstream linked via project. Evaluate updated codec/version and browser performance when upgrading.
- fflate 0.8.3 (MIT): async ZIP, store level=0 because re-compressing JPG/PNG/WebP wastes CPU.
- Pica deferred: browser resize is adequate for v1 pending visual tests, no need to add two resizing engines. MAZANOKE GPL app not copied; Squoosh app not forked. UI and conversion rules are original.

Reproduce vendored assets with `node scripts/sync-image-vendors.mjs` after `npm ci`. Keep package versions and notices synchronized. Source archives are checked in and served only on explicit download, not part of tool startup.

Upstreams:
https://github.com/Donaldcwl/browser-image-compression
https://github.com/hoppergee/heic-to/tree/v1.5.2
https://github.com/strukturag/libheif/tree/v1.22.2
https://github.com/strukturag/libde265/tree/v1.0.16
https://github.com/jamsinclair/jSquash
https://github.com/101arrowz/fflate
