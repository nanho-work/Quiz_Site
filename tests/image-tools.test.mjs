import test from "node:test";
import assert from "node:assert/strict";
import {
  fileIssue,
  dimensions,
  outputName,
  restoreSettings,
  MAX_FILE_BYTES,
} from "../lib/image-tools/rules.ts";
test("accept supported extensions without relying on mobile MIME values", () => {
  for (const name of ["휴가.HEIC", "a.heif", "a.jpeg", "a.png", "a.webp"])
    assert.equal(fileIssue({ name, size: 100 }), null);
  assert.equal(fileIssue({ name: "a.gif", size: 100 }), "unsupported");
  assert.equal(fileIssue({ name: "x.svg", size: 100 }), "unsupported");
  assert.equal(fileIssue({ name: "a.jpg", size: 0 }), "empty");
  assert.equal(
    fileIssue({ name: "a.jpg", size: MAX_FILE_BYTES + 1 }),
    "tooLarge",
  );
});
test("fit width preserves portrait and landscape aspect ratio without upscaling", () => {
  assert.deepEqual(dimensions(4000, 3000, 1200), { width: 1200, height: 900 });
  assert.deepEqual(dimensions(3000, 4000, 1200), { width: 1200, height: 1600 });
  assert.deepEqual(dimensions(400, 300, 1200), { width: 400, height: 300 });
  assert.deepEqual(dimensions(4000, 3000, 0), { width: 4000, height: 3000 });
});
test("output names cannot form zip paths and remain unique across extensions and case", () => {
  const used = new Set();
  assert.equal(outputName("photo.heic", "jpeg", used), "photo-koofy.jpg");
  assert.equal(outputName("photo.png", "jpeg", used), "photo-koofy-2.jpg");
  assert.equal(outputName("PHOTO.JPG", "jpeg", used), "PHOTO-koofy-3.jpg");
  assert(!outputName("../a.jpg", "png", used).includes("/"));
});
test("untrusted saved preferences are bounded and allowResize false is retained", () => {
  const result = restoreSettings({
    format: "svg",
    maxWidth: Infinity,
    targetKB: -1,
    quality: 99,
    background: "url(x)",
    allowResize: false,
  });
  assert.equal(result.format, "jpeg");
  assert.equal(result.maxWidth, 0);
  assert.equal(result.targetKB, 1024);
  assert.equal(result.quality, 0.85);
  assert.equal(result.background, "#ffffff");
  assert.equal(result.allowResize, false);
});
