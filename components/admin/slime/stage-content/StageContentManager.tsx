"use client";

import { CheckCircle2, Download, FileJson, FlaskConical, LoaderCircle, RefreshCw, Rocket, Save, ShieldAlert, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  adminErrorMessage,
  getStageContentRelease,
  initializeStageContent,
  listStageContentChannels,
  listStageContentReleases,
  promoteStageContentToProduction,
  publishStageContentToTest,
  validateStageContent,
} from "../../../../lib/admin/firebase/admin-api";
import {
  changedStageIds,
  cloneStageBundle,
  isProgressionChanged,
  localBundleFingerprint,
  newContentVersion,
  parseStageContentBundle,
  serializeStageBundle,
  stageNumberLabel,
} from "../../../../lib/admin/stage-content/editor";
import type {
  StageContentBundle,
  StageContentChannelSummary,
  StageContentReleaseSummary,
  StageEditorSection,
} from "../../../../lib/admin/stage-content/types";
import { AdminCard } from "../../shared/AdminCard";
import { AdminNotice } from "../../shared/AdminNotice";
import { StageDefinitionForm } from "./StageDefinitionForm";
import { StageProgressionForm } from "./StageProgressionForm";
import { StageChannelCards, StageReleaseHistory } from "./StageReleasePanel";
import { StageTestersPanel } from "./StageTestersPanel";

const sections: Array<{ id: StageEditorSection; label: string }> = [
  { id: "stage", label: "스테이지 설정" },
  { id: "progression", label: "난이도 · 보상" },
  { id: "releases", label: "배포 · TEST 계정" },
  { id: "json", label: "JSON 도구" },
];

export function StageContentManager() {
  const [channels, setChannels] = useState<StageContentChannelSummary[]>([]);
  const [releases, setReleases] = useState<StageContentReleaseSummary[]>([]);
  const [bundle, setBundle] = useState<StageContentBundle | null>(null);
  const [baseline, setBaseline] = useState<StageContentBundle | null>(null);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [selectedStageId, setSelectedStageId] = useState("stage_01");
  const [section, setSection] = useState<StageEditorSection>("stage");
  const [note, setNote] = useState("");
  const [validatedFingerprint, setValidatedFingerprint] = useState<string | null>(null);
  const [validatedReleaseId, setValidatedReleaseId] = useState<string | null>(null);
  const [productionChecked, setProductionChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshMetadata = useCallback(async () => {
    const [channelResponse, releaseResponse] = await Promise.all([
      listStageContentChannels(),
      listStageContentReleases(),
    ]);
    setChannels(channelResponse.items);
    setReleases(releaseResponse.items);
    return { channels: channelResponse.items, releases: releaseResponse.items };
  }, []);

  const loadRelease = useCallback(async (releaseId: string) => {
    setWorking("load");
    setError(null);
    setSuccess(null);
    try {
      const response = await getStageContentRelease(releaseId);
      const parsed = parseStageContentBundle(response.bundleJson);
      setBundle(parsed);
      setBaseline(cloneStageBundle(parsed));
      setSelectedReleaseId(response.releaseId);
      setSelectedStageId((current) => parsed.stages.some((stage) => stage.id === current) ? current : parsed.stages[0].id);
      setValidatedFingerprint(localBundleFingerprint(parsed));
      setValidatedReleaseId(response.releaseId);
      setProductionChecked(false);
      setNote("");
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setWorking(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      try {
        const metadata = await refreshMetadata();
        if (!active) return;
        const productionId = metadata.channels.find((item) => item.channel === "production")?.releaseId;
        const firstId = productionId ?? metadata.releases[0]?.releaseId;
        if (firstId) await loadRelease(firstId);
      } catch (nextError) {
        if (active) setError(adminErrorMessage(nextError));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [loadRelease, refreshMetadata]);

  const updateBundle = (next: StageContentBundle) => {
    setBundle(next);
    setValidatedFingerprint(null);
    setValidatedReleaseId(null);
    setProductionChecked(false);
    setError(null);
    setSuccess(null);
  };
  const changedStages = useMemo(() => changedStageIds(baseline, bundle), [baseline, bundle]);
  const progressionChanged = useMemo(() => isProgressionChanged(baseline, bundle), [baseline, bundle]);
  const dirty = bundle !== null && baseline !== null && localBundleFingerprint(bundle) !== localBundleFingerprint(baseline);
  const validated = bundle !== null && validatedFingerprint === localBundleFingerprint(bundle);
  const testReleaseId = channels.find((item) => item.channel === "test")?.releaseId ?? null;
  const productionReleaseId = channels.find((item) => item.channel === "production")?.releaseId ?? null;
  const selectedStage = bundle?.stages.find((stage) => stage.id === selectedStageId) ?? bundle?.stages[0];

  const run = async (name: string, work: () => Promise<void>) => {
    setWorking(name);
    setError(null);
    setSuccess(null);
    try { await work(); } catch (nextError) { setError(adminErrorMessage(nextError)); } finally { setWorking(null); }
  };

  const handleInitialize = () => run("initialize", async () => {
    const response = await initializeStageContent();
    await refreshMetadata();
    await loadRelease(response.releaseId);
    setSuccess("패키지에 포함된 스테이지 1~10을 최초 production 기준으로 생성했습니다.");
  });

  const handleValidate = () => bundle && run("validate", async () => {
    const response = await validateStageContent(serializeStageBundle(bundle));
    const canonical = parseStageContentBundle(response.bundleJson);
    setBundle(canonical);
    setValidatedFingerprint(localBundleFingerprint(canonical));
    setValidatedReleaseId(response.releaseId);
    setSuccess(`서버 검증을 통과했습니다. 후보 릴리스: ${response.releaseId.slice(0, 12)}…`);
  });

  const handlePublishTest = () => bundle && run("publish", async () => {
    if (!validated) throw new Error("현재 편집본을 먼저 서버에서 검증해 주세요.");
    if (note.trim().length < 4) throw new Error("변경 이유를 4자 이상 입력해 주세요.");
    const response = await publishStageContentToTest(serializeStageBundle(bundle), note.trim());
    setBaseline(cloneStageBundle(bundle));
    setSelectedReleaseId(response.releaseId);
    setValidatedReleaseId(response.releaseId);
    setValidatedFingerprint(localBundleFingerprint(bundle));
    await refreshMetadata();
    setSuccess("test 채널에 게시했습니다. 등록한 TEST 실기기 계정에서 확인한 뒤 production으로 승격하세요.");
  });

  const handlePromote = () => run("promote", async () => {
    if (!testReleaseId) throw new Error("먼저 test 채널에 릴리스를 게시해 주세요.");
    if (!productionChecked) throw new Error("실기기 검증 완료 항목을 확인해 주세요.");
    if (!window.confirm("현재 test 릴리스를 production으로 승격하시겠습니까? 이미 실행 중인 전투는 기존 릴리스로 이어집니다.")) return;
    await promoteStageContentToProduction(testReleaseId);
    await refreshMetadata();
    setProductionChecked(false);
    setSuccess("production 승격을 완료했습니다.");
  });

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 800_000) { setError("JSON 파일은 800KB를 넘을 수 없습니다."); return; }
    try {
      const parsed = parseStageContentBundle(await file.text());
      updateBundle(parsed);
      setSelectedStageId(parsed.stages[0].id);
      setSuccess("JSON을 편집기에 불러왔습니다. 아직 서버에는 저장되지 않았습니다.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "JSON 파일을 읽지 못했습니다.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) return <div className="flex min-h-80 items-center justify-center text-slate-500"><LoaderCircle className="mr-3 h-5 w-5 animate-spin" /> 스테이지 운영 정보를 불러오는 중입니다.</div>;

  return (
    <div className="space-y-6">
      <StageChannelCards channels={channels} />
      {error ? <AdminNotice tone="error">{error}</AdminNotice> : null}
      {success ? <AdminNotice tone="success">{success}</AdminNotice> : null}

      {!bundle ? (
        <AdminCard className="p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-300" />
          <h2 className="mt-4 text-lg font-bold text-white">스테이지 콘텐츠가 초기화되지 않았습니다</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">앱에 포함된 스테이지 1~10을 변경 없이 최초 production 릴리스로 생성합니다. 이 작업은 한 번만 가능합니다.</p>
          <button type="button" disabled={working !== null} onClick={() => void handleInitialize()} className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50">{working === "initialize" ? "생성 중…" : "초기 스테이지 생성"}</button>
        </AdminCard>
      ) : (
        <>
          <AdminCard className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-slate-800 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-white">{bundle.contentVersion}</h2>{dirty ? <Status tone="changed">수정 중</Status> : <Status tone="saved">불러온 상태</Status>}{validated ? <Status tone="valid">검증 완료</Status> : null}</div><p className="mt-1 truncate font-mono text-[10px] text-slate-600">기준 릴리스: {selectedReleaseId ?? "가져온 JSON"}</p></div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => updateBundle({ ...bundle, contentVersion: newContentVersion(bundle.contentVersion), stageProgression: { ...bundle.stageProgression, contentVersion: newContentVersion(bundle.contentVersion) } })} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800">새 편집 버전명</button>
                <button type="button" disabled={working !== null} onClick={() => void handleValidate()} className="flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-bold text-sky-200 disabled:opacity-40"><FlaskConical className="h-4 w-4" /> {working === "validate" ? "검증 중" : "서버 검증"}</button>
                <button type="button" disabled={working !== null || !validated} onClick={() => void handlePublishTest()} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-40"><Save className="h-4 w-4" /> {working === "publish" ? "게시 중" : "TEST 게시"}</button>
              </div>
            </div>
            <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/40 px-2">
              {sections.map((item) => <button key={item.id} type="button" onClick={() => setSection(item.id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-bold transition ${section === item.id ? "border-emerald-400 text-emerald-300" : "border-transparent text-slate-500 hover:text-slate-300"}`}>{item.label}</button>)}
            </div>
          </AdminCard>

          {section === "stage" && selectedStage ? (
            <div className="grid items-start gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
              <AdminCard className="overflow-hidden xl:sticky xl:top-24">
                <div className="border-b border-slate-800 px-4 py-3"><p className="text-xs font-bold text-slate-500">편집할 스테이지</p></div>
                <div className="max-h-[70vh] overflow-y-auto p-2">{bundle.stages.map((stage) => <button type="button" key={stage.id} onClick={() => setSelectedStageId(stage.id)} className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${stage.id === selectedStage.id ? "bg-emerald-500/10 font-bold text-emerald-300" : "text-slate-400 hover:bg-slate-800"}`}><span>{stageNumberLabel(stage.id)}</span>{changedStages.includes(stage.id) ? <span className="h-2 w-2 rounded-full bg-amber-400" /> : null}</button>)}</div>
              </AdminCard>
              <StageDefinitionForm stage={selectedStage} onChange={(next) => updateBundle({ ...bundle, stages: bundle.stages.map((stage) => stage.id === next.id ? next : stage) })} />
            </div>
          ) : null}

          {section === "progression" ? <StageProgressionForm bundle={bundle} onChange={updateBundle} /> : null}

          {section === "releases" ? <div className="space-y-5"><StageTestersPanel testReleaseId={testReleaseId} productionReleaseId={productionReleaseId} /><ProductionPromotion testReleaseId={testReleaseId} productionReleaseId={productionReleaseId} checked={productionChecked} working={working === "promote"} onChecked={setProductionChecked} onPromote={() => void handlePromote()} /><StageReleaseHistory releases={releases} channels={channels} selectedReleaseId={selectedReleaseId} loading={working === "load"} onLoad={(releaseId) => { if (!dirty || window.confirm("저장하지 않은 편집 내용을 버리고 선택한 릴리스를 불러올까요?")) void loadRelease(releaseId); }} /></div> : null}

          {section === "json" ? <JsonTools bundle={bundle} fileInputRef={fileInputRef} onImport={handleImport} onApply={updateBundle} /> : null}

          <AdminCard className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <label className="text-xs font-bold text-slate-400">변경 메모<input value={note} maxLength={500} onChange={(event) => setNote(event.target.value)} placeholder="예: 스테이지 1 초반 체력 완화" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" /></label>
              <div className="text-xs leading-5 text-slate-500"><p>변경 스테이지: <strong className="text-slate-300">{changedStages.length ? changedStages.map(stageNumberLabel).join(", ") : "없음"}</strong></p><p>난이도·보상 변경: <strong className={progressionChanged ? "text-amber-300" : "text-slate-300"}>{progressionChanged ? "있음" : "없음"}</strong></p><p>검증 후보: <span className="font-mono">{validatedReleaseId?.slice(0, 12) ?? "-"}</span></p></div>
            </div>
          </AdminCard>
        </>
      )}
    </div>
  );
}

function ProductionPromotion({ testReleaseId, productionReleaseId, checked, working, onChecked, onPromote }: { testReleaseId: string | null; productionReleaseId: string | null; checked: boolean; working: boolean; onChecked: (value: boolean) => void; onPromote: () => void }) {
  const same = testReleaseId !== null && testReleaseId === productionReleaseId;
  return <AdminCard className="p-5"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2"><Rocket className="h-5 w-5 text-amber-300" /><h2 className="font-bold text-white">Production 승격</h2></div><p className="mt-2 text-sm text-slate-400">test 릴리스를 등록된 TEST 실기기 계정에서 검증한 뒤에만 production으로 이동합니다.</p><p className="mt-2 font-mono text-[10px] text-slate-600">TEST: {testReleaseId ?? "설정되지 않음"}</p></div><div className="space-y-3"><label className="flex items-center gap-2 text-xs font-semibold text-slate-300"><input type="checkbox" checked={checked} onChange={(event) => onChecked(event.target.checked)} disabled={!testReleaseId || same} className="h-4 w-4 accent-emerald-500" /> 등록한 TEST 계정의 실기기에서 경로·난이도·보상을 확인했습니다.</label><button type="button" disabled={!testReleaseId || same || !checked || working} onClick={onPromote} className="w-full rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-950 disabled:opacity-30">{same ? "이미 Production 적용 중" : working ? "승격 중…" : "Production으로 승격"}</button></div></div></AdminCard>;
}

function JsonTools({ bundle, fileInputRef, onImport, onApply }: { bundle: StageContentBundle; fileInputRef: React.RefObject<HTMLInputElement>; onImport: (file: File | undefined) => void; onApply: (bundle: StageContentBundle) => void }) {
  const [draft, setDraft] = useState(() => serializeStageBundle(bundle));
  useEffect(() => setDraft(serializeStageBundle(bundle)), [bundle]);
  const download = () => { const blob = new Blob([serializeStageBundle(bundle)], { type: "application/json" }); const href = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = href; link.download = `${bundle.contentVersion}.json`; link.click(); URL.revokeObjectURL(href); };
  const apply = () => { try { onApply(parseStageContentBundle(draft)); } catch (error) { window.alert(error instanceof Error ? error.message : "JSON을 적용하지 못했습니다."); } };
  return <AdminCard className="p-5 md:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><FileJson className="h-5 w-5 text-slate-500" /><h2 className="font-bold text-white">JSON 가져오기 · 내보내기</h2></div><p className="mt-1 text-xs text-slate-500">고급 사용자용 보조 기능입니다. 일반 수정은 폼 화면을 사용하세요.</p></div><div className="flex gap-2"><input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void onImport(event.target.files?.[0])} /><button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300"><Upload className="h-4 w-4" /> 가져오기</button><button type="button" onClick={download} className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300"><Download className="h-4 w-4" /> 내보내기</button></div></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck={false} className="mt-5 min-h-[520px] w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-300 outline-none focus:border-emerald-500" /><button type="button" onClick={apply} className="mt-3 rounded-lg bg-slate-700 px-4 py-2 text-xs font-bold text-white">JSON 변경을 편집기에 적용</button></AdminCard>;
}

function Status({ tone, children }: { tone: "changed" | "saved" | "valid"; children: React.ReactNode }) {
  const style = tone === "changed" ? "bg-amber-500/10 text-amber-300" : tone === "valid" ? "bg-sky-500/10 text-sky-300" : "bg-slate-800 text-slate-400";
  return <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${style}`}>{tone === "valid" ? <CheckCircle2 className="h-3 w-3" /> : null}{children}</span>;
}
