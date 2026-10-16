// Keep browser codecs replaceable and serve all processing assets from our own origin.
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
};
const modules = path.join(root, "node_modules"),
  vendor = path.join(root, "public/vendor/koofy-image"),
  licenses = path.join(root, "public/licenses/koofy-image");
for (const [from, to] of [
  ["heic-to/dist/csp/heic-to.js", "heic-to-1.5.2.js"],
  [
    "browser-image-compression/dist/browser-image-compression.js",
    "browser-image-compression-2.0.2.js",
  ],
  ["@jsquash/webp/codec/enc/webp_enc.wasm", "webp_enc.wasm"],
  ["@jsquash/webp/codec/enc/webp_enc_simd.wasm", "webp_enc_simd.wasm"],
])
  copy(path.join(modules, from), path.join(vendor, to));
for (const [from, to] of [
  ["heic-to/LICENSE", "heic-to-LGPL-3.0.txt"],
  ["browser-image-compression/LICENSE", "browser-image-compression-MIT.txt"],
  ["fflate/LICENSE", "fflate-MIT.txt"],
  ["@jsquash/webp/LICENSE", "jsquash-Apache-2.0.txt"],
  ["@jsquash/webp/codec/LICENSE.codec.md", "libwebp-BSD.txt"],
  ["wasm-feature-detect/LICENSE", "wasm-feature-detect-Apache-2.0.txt"],
])
  copy(path.join(modules, from), path.join(licenses, to));
console.log("Synced Koofy Image codecs and license notices.");
