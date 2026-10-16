/* eslint-disable @next/next/no-img-element -- Local blob previews must not use server image optimization. */
"use client";
import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  ArrowDownToLine,
  ArrowRight,
  ShieldCheck,
  X,
  SlidersHorizontal,
  Check,
  LoaderCircle,
  Images,
  ZoomIn,
} from "lucide-react";
import { useLanguage } from "../LanguageProvider";
import { imageCopy } from "../../lib/image-tools/copy";
import {
  bytesLabel,
  DEFAULT_SETTINGS,
  fileIssue,
  MAX_BATCH_BYTES,
  MAX_FILES,
  outputName,
  restoreSettings,
  type Settings,
} from "../../lib/image-tools/rules";
import { convertImage, makePreview, type Converted } from "../../lib/image-tools/convert";
import styles from "./ImageTool.module.css";
type Item = {
  id: string;
  file: File;
  preview?: string;
  sourcePreview?: string;
  result?: Converted;
  resultURL?: string;
  resultThumbURL?: string;
  name?: string;
  status: "waiting" | "processing" | "done" | "failed" | "cancelled";
  progress: number;
  error?: string;
  downloaded?: boolean;
};
const STORAGE = "koofy-image-settings-v1";
export default function ImageTool() {
  const { language } = useLanguage();
  const t = language === "ko" ? imageCopy.ko : imageCopy.en;
  const [items, setItems] = useState<Item[]>([]);
  const [settings, setSettings] = useState<Settings>({ ...DEFAULT_SETTINGS });
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [drag, setDrag] = useState(false),
    [zipBusy, setZipBusy] = useState(false);
  const [notice, setNotice] = useState(""),
    [comparing, setComparing] = useState<string | null>(null),
    [customTarget, setCustomTarget] = useState("1024"),
    [customWidth, setCustomWidth] = useState("");
  const thumbQueue = useRef<Promise<void>>(Promise.resolve());
  const input = useRef<HTMLInputElement>(null),
    controller = useRef<AbortController | null>(null),
    urls = useRef(new Set<string>()),
    current = useRef(items),
    lock = useRef(false),
    modalClose = useRef<HTMLButtonElement>(null),
    compareTrigger = useRef<HTMLElement | null>(null),
    mounted = useRef(true);
  current.current = items;
  useEffect(() => {
    const ownedURLs = urls.current;
    mounted.current = true;
    try {
      const saved = restoreSettings(
        JSON.parse(localStorage.getItem(STORAGE) || "null"),
      );
      setSettings(saved);
      setCustomTarget(String(saved.targetKB));
      setCustomWidth(saved.maxWidth ? String(saved.maxWidth) : "");
    } catch {}
    setReady(true);
    return () => {
      mounted.current = false;
      controller.current?.abort();
      ownedURLs.forEach((url) => URL.revokeObjectURL(url));
      ownedURLs.clear();
    };
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(STORAGE, JSON.stringify(settings));
      } catch {}
  }, [ready, settings]);
  useEffect(() => {
    const leave = (e: BeforeUnloadEvent) => {
      if (
        lock.current ||
        current.current.some((i) => i.result && !i.downloaded)
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, []);
  useEffect(() => {
    if (!comparing) return;
    modalClose.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setComparing(null);
      if (e.key === "Tab") {
        e.preventDefault();
        modalClose.current?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      compareTrigger.current?.focus();
    };
  }, [comparing]);
  function objectURL(blob: Blob) {
    const url = URL.createObjectURL(blob);
    urls.current.add(url);
    return url;
  }
  function free(item: Item) {
    [
      item.preview,
      item.resultURL,
      item.sourcePreview,
      item.resultThumbURL,
    ].forEach((url) => {
      if (url) {
        URL.revokeObjectURL(url);
        urls.current.delete(url);
      }
    });
  }
  function addFiles(files: File[]) {
    if (lock.current || zipBusy) return;
    const rejected: string[] = [],
      next = [...current.current];
    let size = next.reduce((sum, i) => sum + i.file.size, 0);
    for (const file of files) {
      if (
        next.some(
          (i) =>
            i.file.name === file.name &&
            i.file.size === file.size &&
            i.file.lastModified === file.lastModified,
        )
      )
        continue;
      const issue = fileIssue(file);
      if (issue) {
        rejected.push(`${file.name}: ${t.errors[issue]}`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        rejected.push(t.errors.count);
        break;
      }
      if (size + file.size > MAX_BATCH_BYTES) {
        rejected.push(`${file.name}: ${t.errors.batch}`);
        continue;
      }
      size += file.size;
      const id = crypto.randomUUID();
      next.push({ id, file, status: "waiting", progress: 0 });
      if (!/\.(heic|heif)$/i.test(file.name)) {
        thumbQueue.current = thumbQueue.current
          .then(async () => {
            if (!mounted.current || !current.current.some((i) => i.id === id))
              return;
            const blob = await makePreview(file);
            if (mounted.current && current.current.some((i) => i.id === id))
              patch(id, { preview: objectURL(blob) });
          })
          .catch(() => {});
      }
    }
    current.current = next;
    setItems(next);
    setNotice([...new Set(rejected)].join("\n"));
    if (input.current) input.current.value = "";
  }
  function patch(id: string, update: Partial<Item>) {
    if (mounted.current)
      setItems((old) =>
        old.map((i) => (i.id === id ? { ...i, ...update } : i)),
      );
  }
  function update(value: Partial<Settings>) {
    setSettings((old) => ({ ...old, ...value }));
  }
  async function run(retry = false) {
    if (lock.current || zipBusy || !items.length) return;
    const targetKB = Number(customTarget),
      maxWidth = customWidth === "" ? 0 : Number(customWidth);
    if (
      (settings.mode === "compress" &&
        (!Number.isFinite(targetKB) || targetKB < 10 || targetKB > 25600)) ||
      !Number.isInteger(maxWidth) ||
      maxWidth < 0 ||
      maxWidth > 8192
    ) {
      setNotice(t.errors.settings);
      return;
    }
    const snapshot = {
      ...settings,
      targetKB: settings.mode === "compress" ? targetKB : settings.targetKB,
      maxWidth,
    };
    setSettings(snapshot);
    lock.current = true;
    setBusy(true);
    setComparing(null);
    setNotice("");
    const abort = new AbortController();
    controller.current = abort;
    const batch = [...current.current],
      selected = batch.filter(
        (i) => !retry || i.status === "failed" || i.status === "cancelled",
      );
    const used = new Set(
      retry
        ? batch
            .filter((i) => !selected.includes(i))
            .flatMap((i) => (i.name ? [i.name.toLowerCase()] : []))
        : [],
    );
    selected.forEach((item) => {
      if (item.resultURL) {
        URL.revokeObjectURL(item.resultURL);
        urls.current.delete(item.resultURL);
      }
      if (item.sourcePreview) {
        URL.revokeObjectURL(item.sourcePreview);
        urls.current.delete(item.sourcePreview);
      }
      if (item.resultThumbURL) {
        URL.revokeObjectURL(item.resultThumbURL);
        urls.current.delete(item.resultThumbURL);
      }
    });
    setItems((old) =>
      old.map((i) =>
        selected.some((s) => s.id === i.id)
          ? {
              ...i,
              result: undefined,
              resultURL: undefined,
              resultThumbURL: undefined,
              sourcePreview: undefined,
              status: "waiting",
              progress: 0,
              error: undefined,
              downloaded: false,
            }
          : i,
      ),
    );
    try {
      for (const item of selected) {
        if (abort.signal.aborted) break;
        patch(item.id, { status: "processing", progress: 1 });
        try {
          const result = await convertImage(
            item.file,
            snapshot,
            abort.signal,
            (progress: number) => patch(item.id, { progress }),
          );
          if (abort.signal.aborted || !mounted.current) break;
          const thumbnail = await makePreview(result.blob);
          if (abort.signal.aborted || !mounted.current) break;
          patch(item.id, {
            result,
            resultURL: objectURL(result.blob),
            resultThumbURL: objectURL(thumbnail),
            preview: item.preview || objectURL(thumbnail),
            name: outputName(item.file.name, snapshot.format, used),
            status: "done",
            progress: 100,
          });
        } catch (error) {
          if (abort.signal.aborted) break;
          const code =
            error && typeof error === "object" && "code" in error
              ? String(error.code)
              : "decode";
          patch(item.id, { status: "failed", error: code });
        }
      }
    } catch {
      setNotice(t.errors.encode);
    } finally {
      if (mounted.current) {
        setItems((old) =>
          old.map((i) =>
            i.status === "waiting" || i.status === "processing"
              ? { ...i, status: "cancelled", progress: 0 }
              : i,
          ),
        );
        setBusy(false);
      }
      lock.current = false;
      controller.current = null;
    }
  }
  function saveURL(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  async function downloadZIP() {
    if (lock.current || zipBusy) return;
    setZipBusy(true);
    setNotice("");
    try {
      const { zip } = await import("fflate");
      const done = current.current.filter((i) => i.result && i.name);
      const files: Record<string, Uint8Array> = {};
      for (const i of done)
        files[i.name!] = new Uint8Array(await i.result!.blob.arrayBuffer());
      const blob = await new Promise<Blob>((resolve, reject) =>
        zip(files, { level: 0 }, (error, data) =>
          error
            ? reject(error)
            : resolve(new Blob([data], { type: "application/zip" })),
        ),
      );
      const url = objectURL(blob);
      saveURL(url, "koofy-images.zip");
      setTimeout(() => {
        URL.revokeObjectURL(url);
        urls.current.delete(url);
      }, 60_000);
      setItems((old) =>
        old.map((i) => (i.result ? { ...i, downloaded: true } : i)),
      );
    } catch {
      setNotice(t.errors.zip);
    } finally {
      setZipBusy(false);
    }
  }
  const done = items.filter((i) => i.result),
    totals = done.reduce(
      (a, i) => ({
        before: a.before + i.file.size,
        after: a.after + i.result!.blob.size,
      }),
      { before: 0, after: 0 },
    );
  const comparison = items.find((i) => i.id === comparing),
    working = items.find((i) => i.status === "processing");
  return (
    <div className={styles.tool} lang={language === "ko" ? "ko" : "en"}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            KOOFY IMAGE <span>BETA</span>
          </p>
          <h1>
            {t.name}
            <span>{t.title}</span>
          </h1>
          <p>{t.intro}</p>
          <span className={styles.free}>{t.free}</span>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <div>
            HEIC<span>8.4 MB</span>
          </div>
          <ArrowRight size={27} />
          <div>
            JPG<span>482 KB</span>
          </div>
          <small>CONVERT · COMPRESS</small>
        </div>
      </header>
      <div className={styles.privacy}>
        <ShieldCheck size={22} />
        <div>
          <strong>{t.local}</strong>
          <p>{t.localBody}</p>
        </div>
      </div>
      <div className={styles.workspace}>
        <section className={styles.files}>
          <div className={styles.sectionTitle}>
            <h2>
              <b>01</b>
              {t.step1}
              <small>{items.length}/10</small>
            </h2>
            {items.length > 0 && (
              <button
                disabled={busy || zipBusy}
                onClick={() => {
                  items.forEach(free);
                  setComparing(null);
                  current.current = [];
                  setItems([]);
                  setNotice("");
                }}
              >
                {t.clear}
              </button>
            )}
          </div>
          <input
            className={styles.srOnly}
            ref={input}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
            aria-label={t.choose}
            disabled={busy || zipBusy}
            onChange={(e) => addFiles(Array.from(e.target.files || []))}
          />
          <button
            type="button"
            disabled={busy || zipBusy || items.length >= 10}
            className={`${styles.drop} ${drag ? styles.dragging : ""} ${items.length ? styles.compact : ""}`}
            onClick={() => input.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              if (!busy) setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              addFiles(Array.from(e.dataTransfer.files));
            }}
          >
            <ImagePlus size={items.length ? 25 : 40} />
            <strong>{items.length ? t.add : t.drop}</strong>
            {!items.length && (
              <>
                <span>{t.dropSub}</span>
                <small>{t.limits}</small>
              </>
            )}
          </button>
          <ul className={styles.fileList}>
            {items.map((item) => (
              <li key={item.id}>
                <div className={styles.thumb}>
                  {item.preview ? (
                    <img
                      src={item.preview}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  ) : (
                    <Images size={25} />
                  )}
                </div>
                <div className={styles.fileInfo}>
                  <strong title={item.file.name}>{item.file.name}</strong>
                  <small>
                    {bytesLabel(item.file.size)}
                    {item.result &&
                      ` · ${item.result.originalWidth} × ${item.result.originalHeight}`}
                  </small>
                  <span
                    className={item.status === "failed" ? styles.error : ""}
                  >
                    {t[item.status]}
                    {item.status === "processing" && ` ${item.progress}%`}
                  </span>
                </div>
                <button
                  aria-label={`${t.remove}: ${item.file.name}`}
                  disabled={busy || zipBusy}
                  onClick={() => {
                    free(item);
                    setItems((old) => old.filter((i) => i.id !== item.id));
                  }}
                >
                  <X size={17} />
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.settings}>
          <div className={styles.sectionTitle}>
            <h2>
              <b>02</b>
              {t.step2}
            </h2>
            <SlidersHorizontal size={19} />
          </div>
          <fieldset disabled={busy || zipBusy}>
            <div className={styles.modes}>
              {(["convert", "compress"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={settings.mode === mode}
                  className={settings.mode === mode ? styles.selected : ""}
                  onClick={() => update({ mode })}
                >
                  <strong>{t[mode]}</strong>
                  <small>
                    {mode === "convert" ? t.convertDesc : t.compressDesc}
                  </small>
                </button>
              ))}
            </div>
            <label>
              {t.format}
              <select
                value={settings.format}
                onChange={(e) =>
                  update({ format: e.target.value as Settings["format"] })
                }
              >
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </label>
            {settings.mode === "compress" && (
              <label>
                {t.target}
                <div className={styles.presets}>
                  {[200, 500, 1024, 2048].map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      aria-pressed={customTarget === String(kb)}
                      onClick={() => {
                        setCustomTarget(String(kb));
                        update({ targetKB: kb });
                      }}
                    >
                      {kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`}
                    </button>
                  ))}
                </div>
                <input
                  aria-label={t.custom}
                  type="number"
                  min="10"
                  max="25600"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                />
                <small>{t.custom}</small>
              </label>
            )}
            <details className={styles.details}>
              <summary>{t.advanced}</summary>
              <label>
                {t.width}
                <select
                  aria-label={t.width}
                  value={
                    ["", "1200", "1920", "2560"].includes(customWidth)
                      ? customWidth
                      : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value !== "custom") {
                      setCustomWidth(e.target.value);
                      update({ maxWidth: Number(e.target.value) });
                    } else setCustomWidth("1600");
                  }}
                >
                  <option value="">{t.original}</option>
                  <option value="1200">1200 px</option>
                  <option value="1920">1920 px</option>
                  <option value="2560">2560 px</option>
                  <option value="custom">{t.custom.replace("KB", "px")}</option>
                </select>
                <input
                  aria-label={`${t.width} (px)`}
                  type="number"
                  min="1"
                  max="8192"
                  placeholder={t.original}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                />
              </label>
              {settings.format !== "png" && (
                <label>
                  {t.quality} <span>{Math.round(settings.quality * 100)}%</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={Math.round(settings.quality * 100)}
                    onChange={(e) =>
                      update({ quality: Number(e.target.value) / 100 })
                    }
                  />
                </label>
              )}
              {settings.mode === "compress" && (
                <>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={settings.allowResize}
                      onChange={(e) =>
                        update({ allowResize: e.target.checked })
                      }
                    />
                    {t.resize}
                  </label>
                  <p className={styles.hint}>{t.resizeNote}</p>
                </>
              )}
              {settings.format === "jpeg" && (
                <label>
                  {t.background}
                  <input
                    aria-label={t.background}
                    type="color"
                    value={settings.background}
                    onChange={(e) => update({ background: e.target.value })}
                  />
                  <small>{t.backgroundNote}</small>
                </label>
              )}
            </details>
          </fieldset>
          <p className={styles.hint}>{t.editNotice}</p>
          <button
            className={styles.primary}
            disabled={!ready || !items.length || busy || zipBusy}
            onClick={() => void run()}
          >
            {busy ? (
              <LoaderCircle size={19} className={styles.spin} />
            ) : (
              <ArrowRight size={19} />
            )}{" "}
            {busy
              ? `${t.processing} ${items.filter((i) => i.status === "done" || i.status === "failed").length + 1}/${items.length}`
              : t.run}
          </button>
          {busy && (
            <>
              <progress
                max="100"
                value={working?.progress || 0}
                aria-label={t.processing}
              />
              <button
                className={styles.secondary}
                onClick={() => controller.current?.abort()}
              >
                {t.cancel}
              </button>
            </>
          )}
          {!busy &&
            items.some(
              (i) => i.status === "failed" || i.status === "cancelled",
            ) && (
              <button
                className={styles.secondary}
                disabled={zipBusy}
                onClick={() => void run(true)}
              >
                {t.retry}
              </button>
            )}
        </section>
      </div>
      {notice && (
        <p role="alert" className={styles.notice}>
          {notice}
        </p>
      )}
      <section className={styles.results}>
        <div className={styles.sectionTitle}>
          <h2>
            <b>03</b>
            {t.step3}
            {done.length > 0 && <small>{done.length}</small>}
          </h2>
          {done.length > 0 && (
            <button
              className={styles.primary}
              disabled={busy || zipBusy}
              onClick={() => void downloadZIP()}
            >
              <ArrowDownToLine size={18} />
              {zipBusy ? t.zipping : t.zip}
            </button>
          )}
        </div>
        {!done.length && !items.some((i) => i.status === "failed") ? (
          <div className={styles.empty}>
            <Images size={28} />
            <p>{t.empty}</p>
          </div>
        ) : (
          <>
            {done.length > 0 && (
              <div className={styles.totals}>
                <span>
                  {t.total}{" "}
                  <strong>
                    {bytesLabel(totals.before)} → {bytesLabel(totals.after)}
                  </strong>
                </span>
                <span>
                  {totals.after <= totals.before
                    ? `${t.saved} ${Math.round((1 - totals.after / totals.before) * 100)}%`
                    : t.larger}
                </span>
              </div>
            )}
            <div className={styles.resultGrid}>
              {items
                .filter((i) => i.result || i.status === "failed")
                .map((item) => (
                  <article key={item.id} className={styles.resultCard}>
                    {item.result ? (
                      <>
                        <button
                          className={styles.resultPreview}
                          onClick={(e) => {
                            compareTrigger.current = e.currentTarget;
                            patch(item.id, {
                              sourcePreview:
                                item.sourcePreview ||
                                objectURL(item.result!.source),
                            });
                            setComparing(item.id);
                          }}
                          aria-label={`${t.compare}: ${item.file.name}`}
                        >
                          <img
                            src={item.resultThumbURL || item.resultURL}
                            alt={item.name || ""}
                          />
                          <span>
                            <ZoomIn size={15} />
                            {t.compare}
                          </span>
                        </button>
                        <div className={styles.resultBody}>
                          <h3 title={item.name}>{item.name}</h3>
                          <p>
                            {bytesLabel(item.file.size)}{" "}
                            <ArrowRight size={13} />{" "}
                            <strong>{bytesLabel(item.result.blob.size)}</strong>
                          </p>
                          <small>
                            {item.result.width} × {item.result.height} px
                            {item.result.resized && ` · ${t.resized}`}
                          </small>
                          {!item.result.targetMet && (
                            <p className={styles.warning}>{t.targetMissed}</p>
                          )}
                          <button
                            disabled={busy || zipBusy}
                            className={styles.secondary}
                            onClick={() => {
                              saveURL(item.resultURL!, item.name!);
                              patch(item.id, { downloaded: true });
                            }}
                          >
                            {item.downloaded ? (
                              <Check size={16} />
                            ) : (
                              <ArrowDownToLine size={16} />
                            )}{" "}
                            {t.download}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={styles.resultBody}>
                        <h3>{item.file.name}</h3>
                        <p className={styles.error}>
                          {t.errors[item.error as keyof typeof t.errors] ||
                            t.errors.decode}
                        </p>
                      </div>
                    )}
                  </article>
                ))}
            </div>
          </>
        )}
      </section>
      <p className={styles.metadata}>{t.metadata}</p>
      <section className={styles.faq}>
        <h2>{t.faqTitle}</h2>
        {t.faq.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
        <a href="/koofy-image/licenses">{t.licenses} ↗</a>
      </section>
      {comparison?.result && (
        <div className={styles.modalOverlay} onClick={() => setComparing(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="comparison-title"
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sectionTitle}>
              <h2 id="comparison-title">{t.compare}</h2>
              <button
                ref={modalClose}
                onClick={() => setComparing(null)}
                aria-label={t.close}
              >
                <X />
              </button>
            </div>
            <div className={styles.comparison}>
              <figure>
                <figcaption>
                  {t.originalLabel} · {bytesLabel(comparison.file.size)}
                </figcaption>
                <img
                  src={comparison.sourcePreview || comparison.preview}
                  alt={t.originalLabel}
                />
              </figure>
              <figure>
                <figcaption>
                  {t.resultLabel} · {bytesLabel(comparison.result.blob.size)}
                </figcaption>
                <img src={comparison.resultURL} alt={t.resultLabel} />
              </figure>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
