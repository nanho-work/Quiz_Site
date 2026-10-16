import imageCompression from "browser-image-compression";
import { dimensions, MAX_EDGE, MAX_PIXELS, type Settings } from "./rules";
export class ImageToolError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
export type Converted = {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  targetMet: boolean;
  resized: boolean;
  source: Blob;
};
function check(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException("Cancelled", "AbortError");
}
const mime = (format: Settings["format"]) => `image/${format}`;
async function readImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new ImageToolError("decode"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
async function sourceBlob(file: File, signal: AbortSignal): Promise<Blob> {
  // Check content, not MIME supplied by OS. Only HEVC HEIF brands are accepted here.
  const header = new Uint8Array(await file.slice(0, 128).arrayBuffer());
  const text = new TextDecoder("latin1").decode(header);
  const heic =
    text.slice(4, 8) === "ftyp" &&
    /heic|heix|hevc|hevx|mif1|msf1/.test(text.slice(8));
  if (heic) {
    check(signal);
    // Unmodified LGPL module stays separately replaceable and loads only for HEIC/HEIF.
    const path = "/vendor/koofy-image/heic-to-1.5.2.js";
    const decoder = (await import(/* webpackIgnore: true */ path)) as {
      heicTo: (args: { blob: Blob; type: string }) => Promise<Blob>;
    };
    const result = await decoder.heicTo({ blob: file, type: "image/png" });
    check(signal);
    return result;
  }
  // Do not flatten animated images silently. PNG acTL is checked in the bounded file.
  if (file.type === "image/webp" || /\.webp$/i.test(file.name)) {
    const h = new DataView(header.buffer);
    if (
      text.slice(12, 16) === "VP8X" &&
      header.length > 20 &&
      h.getUint8(20) & 2
    )
      throw new ImageToolError("animated");
  }
  if (/\.png$/i.test(file.name)) {
    const data = new Uint8Array(await file.arrayBuffer());
    const view = new DataView(data.buffer);
    for (let i = 8; i + 12 <= data.length; ) {
      const chunk = String.fromCharCode(...data.slice(i + 4, i + 8));
      if (chunk === "acTL") throw new ImageToolError("animated");
      const length = view.getUint32(i);
      if (length > data.length - i - 12) break;
      i += length + 12;
    }
  }
  return file;
}
let webpInit: Promise<unknown> | undefined;
async function encode(
  canvas: HTMLCanvasElement,
  settings: Settings,
  quality: number,
  signal: AbortSignal,
) {
  check(signal);
  const type = mime(settings.format);
  if (settings.format !== "webp") {
    const seed = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new ImageToolError("encode"))),
        "image/png",
      ),
    );
    const compress = imageCompression;
    const result = await compress(
      new File([seed], "work.png", { type: seed.type }),
      {
        fileType: type,
        initialQuality: quality,
        maxIteration: 1,
        alwaysKeepResolution: true,
        useWebWorker: true,
        signal,
        libURL: `${location.origin}/vendor/koofy-image/browser-image-compression-2.0.2.js`,
        preserveExif: false,
      },
    );
    if (result.type !== type) throw new ImageToolError("encode");
    return result;
  }
  const result = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, quality),
  );
  if (result?.type === type) return result;
  // Safari may return PNG when WebP encoding is unsupported. Never mislabel that file.
  const { default: encodeWebp, init } = await import("@jsquash/webp/encode.js");
  webpInit ??= init({
    locateFile: (name: string) => `/vendor/koofy-image/${name}`,
  });
  await webpInit;
  check(signal);
  const context = canvas.getContext("2d")!;
  const buffer = await encodeWebp(
    context.getImageData(0, 0, canvas.width, canvas.height),
    { quality: quality * 100 },
  );
  check(signal);
  return new Blob([buffer], { type });
}
export async function convertImage(
  file: File,
  settings: Settings,
  signal: AbortSignal,
  progress: (n: number) => void,
): Promise<Converted> {
  check(signal);
  progress(5);
  const source = await sourceBlob(file, signal);
  check(signal);
  const image = await readImage(source);
  check(signal);
  const originalWidth = image.naturalWidth,
    originalHeight = image.naturalHeight;
  if (
    !originalWidth ||
    !originalHeight ||
    originalWidth * originalHeight > MAX_PIXELS ||
    Math.max(originalWidth, originalHeight) > MAX_EDGE
  )
    throw new ImageToolError("pixels");
  let { width, height } = dimensions(
    originalWidth,
    originalHeight,
    settings.maxWidth,
  );
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new ImageToolError("encode");
  function draw() {
    canvas.width = width;
    canvas.height = height;
    if (settings.format === "jpeg") {
      context!.fillStyle = settings.background;
      context!.fillRect(0, 0, width, height);
    }
    context!.imageSmoothingEnabled = true;
    context!.imageSmoothingQuality = "high";
    context!.drawImage(image, 0, 0, width, height);
  }
  try {
    draw();
    progress(20);
    let best = await encode(canvas, settings, settings.quality, signal);
    const target =
      settings.mode === "compress"
        ? Math.round(settings.targetKB * 1024)
        : Infinity;
    let trials = 0;
    // Search quality at fixed dimensions first, then explicitly permitted downscaling.
    for (let pass = 0; best.size > target && pass < 7; pass++) {
      if (settings.format !== "png") {
        let low = 0.1,
          high = settings.quality;
        let fitting: Blob | null = null;
        for (let i = 0; i < 6; i++) {
          check(signal);
          const quality = (low + high) / 2;
          const candidate = await encode(canvas, settings, quality, signal);
          trials++;
          if (candidate.size < best.size) best = candidate;
          if (candidate.size <= target) {
            fitting = candidate;
            low = quality;
          } else high = quality;
          progress(Math.min(94, 25 + trials * 2));
        }
        if (fitting) {
          best = fitting;
          break;
        }
      }
      if (
        best.size <= target ||
        !settings.allowResize ||
        Math.min(width, height) <= 64 ||
        pass === 6
      )
        break;
      const factor = Math.min(
        0.85,
        Math.max(0.3, Math.sqrt(target / best.size) * 0.95),
      );
      width = Math.max(1, Math.floor(width * factor));
      height = Math.max(1, Math.floor(height * factor));
      draw();
      best = await encode(canvas, settings, settings.quality, signal);
    }
    check(signal);
    progress(100);
    return {
      blob: best,
      width,
      height,
      originalWidth,
      originalHeight,
      targetMet: best.size <= target,
      resized: width !== originalWidth || height !== originalHeight,
      source,
    };
  } finally {
    canvas.width = 1;
    canvas.height = 1;
    image.src = "";
  }
}

// Decode thumbnails one at a time; CSS sizing alone would keep ten full images decoded.
export async function makePreview(
  blob: Blob,
  inspectAlpha?: (transparent: boolean) => void,
): Promise<Blob> {
  const img = await readImage(blob);
  const canvas = document.createElement("canvas");
  try {
    if (
      img.naturalWidth * img.naturalHeight > MAX_PIXELS ||
      Math.max(img.naturalWidth, img.naturalHeight) > MAX_EDGE
    )
      throw new ImageToolError("pixels");
    const ratio = Math.min(
      1,
      320 / Math.max(img.naturalWidth, img.naturalHeight),
    );
    canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
    const context = canvas.getContext("2d")!;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (inspectAlpha) {
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      let transparent = false;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 255) {
          transparent = true;
          break;
        }
      }
      inspectAlpha(transparent);
    }
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new ImageToolError("decode"))),
        "image/png",
      ),
    );
  } finally {
    canvas.width = 1;
    canvas.height = 1;
    img.src = "";
  }
}
