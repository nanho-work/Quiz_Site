// Platform-neutral rules. Keep mobile implementations consistent with this contract.
export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_BATCH_BYTES = 100 * 1024 * 1024;
export const MAX_PIXELS = 40_000_000;
export const MAX_EDGE = 16384;
export type OutputFormat = "jpeg" | "png" | "webp";
export type Settings = {
  mode: "convert" | "compress";
  format: OutputFormat;
  targetKB: number;
  maxWidth: number;
  quality: number;
  allowResize: boolean;
  background: string;
};
export const DEFAULT_SETTINGS: Settings = {
  mode: "convert",
  format: "jpeg",
  targetKB: 1024,
  maxWidth: 0,
  quality: 0.85,
  allowResize: true,
  background: "#ffffff",
};
export function restoreSettings(value: unknown): Settings {
  if (!value || typeof value !== "object") return { ...DEFAULT_SETTINGS };
  const s = value as Partial<Settings>;
  const number = (n: unknown, min: number, max: number, fallback: number) =>
    typeof n === "number" && Number.isFinite(n) && n >= min && n <= max
      ? n
      : fallback;
  return {
    mode: s.mode === "compress" ? "compress" : "convert",
    format: ["jpeg", "png", "webp"].includes(s.format || "")
      ? s.format!
      : "jpeg",
    targetKB: number(s.targetKB, 10, 25600, 1024),
    maxWidth: number(s.maxWidth, 0, 8192, 0),
    quality: number(s.quality, 0.1, 1, 0.85),
    allowResize: typeof s.allowResize === "boolean" ? s.allowResize : true,
    background: /^#[0-9a-f]{6}$/i.test(s.background || "")
      ? s.background!
      : "#ffffff",
  };
}
export function kindFromName(name: string) {
  return /\.(jpe?g|png|webp|heic|heif)$/i.test(name);
}
export function fileIssue(file: {
  name: string;
  size: number;
}): "unsupported" | "empty" | "tooLarge" | null {
  if (!kindFromName(file.name)) return "unsupported";
  if (!file.size) return "empty";
  return file.size > MAX_FILE_BYTES ? "tooLarge" : null;
}
export function dimensions(width: number, height: number, maxWidth: number) {
  const ratio = maxWidth > 0 ? Math.min(1, maxWidth / width) : 1;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}
export function outputName(
  name: string,
  format: OutputFormat,
  used: Set<string>,
) {
  const base =
    (name
      .normalize("NFC")
      .replace(/\.[^.]+$/, "")
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
      .slice(0, 120) || "image") + "-koofy";
  const ext = format === "jpeg" ? "jpg" : format;
  let result = `${base}.${ext}`,
    n = 2;
  while (used.has(result.toLowerCase())) result = `${base}-${n++}.${ext}`;
  used.add(result.toLowerCase());
  return result;
}
export function bytesLabel(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(0.1, bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
