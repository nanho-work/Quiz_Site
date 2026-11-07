'use client';
import {useEffect, useState} from 'react';
import {Activity, Download, RefreshCw, Users} from 'lucide-react';
import {getReaderStatistics, readerCacheNamespace, type ReaderStatisticsResult} from '../../../lib/admin/firebase/reader-api';
import {RoleGuard} from '../shared/RoleGuard';
import {ReaderPageFrame, readerButton} from './ReaderAdminUI';
import {StatCard, StatsTable, StatsTrend, secondsLabel} from './StatisticsUI';

type Source='analytics'|'googlePlay'|'apple';
const sources:{id:Source;label:string}[]=[{id:'analytics',label:'앱 사용'},{id:'googlePlay',label:'Google Play'},{id:'apple',label:'App Store'}];
const links={analytics:'https://analytics.google.com/analytics/web/#/a207349784p555135756/reports/reportinghub',googlePlay:'https://play.google.com/console/u/0/developers/4982189337387504901/app/4973909280783739116/statistics',apple:'https://appstoreconnect.apple.com/apps/6814514729/analytics'};
export function ReaderStatistics(){
 const [source,setSource]=useState<Source>('analytics'),[days,setDays]=useState('28'),[platform,setPlatform]=useState('all'),[tick,setTick]=useState(0);
 const [data,setData]=useState<ReaderStatisticsResult|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState('');
 useEffect(()=>{let live=true;setBusy(true);setError('');setData(null);
  // Same identity boundary as content management; responses never persist in localStorage.
  try{readerCacheNamespace();}catch(e){setError(e instanceof Error?e.message:'관리자 로그인이 필요합니다.');setBusy(false);return;}
  getReaderStatistics(source,days,platform).then(r=>{if(live)setData(r);}).catch(e=>{if(live)setError(e instanceof Error?e.message:'통계를 읽지 못했습니다.');}).finally(()=>{if(live)setBusy(false);});return()=>{live=false;};
 },[source,days,platform,tick]);
 const reports=data?.reports||{},summary=reports.summary?.rows[0];
 return <RoleGuard role="superAdmin"><ReaderPageFrame toolbar={<><h1 className="reader-page-title">통계</h1><span className="text-sm text-slate-500">쿠피리더 운영 현황</span><div className="ml-auto flex flex-wrap items-center gap-3"><label className="text-sm">기간 <select aria-label="조회 기간" value={days} onChange={e=>setDays(e.target.value)}><option value="7">최근 7일</option><option value="28">최근 28일</option></select></label>{source==='analytics'&&<label className="text-sm">플랫폼 <select aria-label="플랫폼" value={platform} onChange={e=>setPlatform(e.target.value)}><option value="all">전체</option><option value="Android">Android</option><option value="iOS">iOS</option></select></label>}<button className={readerButton} onClick={()=>setTick(n=>n+1)} disabled={busy}><RefreshCw size={15}/> 다시 조회</button></div></>}>
  <nav aria-label="통계 출처" className="reader-stats-tabs">{sources.map(s=><button key={s.id} aria-current={source===s.id?'page':undefined} onClick={()=>setSource(s.id)}>{s.label}</button>)}</nav>
  <div className="reader-stats-caption"><div><p>{data?`${data.start} ~ ${data.end}`:'어제까지의 완료된 날짜 기준'}</p><small>{source==='analytics'?'사용 통계를 허용한 사용자 기준입니다. 새 사용자는 스토어 다운로드 수가 아닙니다.':'스토어 보고서의 원래 날짜와 지표 정의를 유지합니다. 앱 사용 통계와 합산하지 않습니다.'}</small></div><a href={links[source]} target="_blank" rel="noreferrer">원본 보고서 ↗</a></div>
  {busy&&<div role="status" className="reader-stats-empty">통계를 불러오고 있어요. 첫 조회는 보고서 수집에 시간이 걸릴 수 있습니다.</div>}
  {!busy&&error&&<div role="alert" className="reader-stats-empty">{error}<p>서버의 통계 기능 배포와 관리자 인증 상태를 확인해 주세요.</p></div>}
  {!busy&&data&&data.status!=='ready'&&<div role="status" className="reader-stats-empty"><h2>{data.status==='setup'?'연결 준비가 필요해요':'현재 통계를 조회할 수 없어요'}</h2><p>{data.message}</p><p>미연결·권한 오류·보고서 지연은 0건과 다릅니다.</p><details><summary>연결 방법</summary>{source==='analytics'?<p>Google Analytics Data API 사용 설정 후 쿠피리더 서버 서비스 계정에 해당 속성의 뷰어 권한을 부여합니다.</p>:source==='googlePlay'?<p>Play Console → 계정 관리 → Play 앱 보고서에서 Cloud Storage URI를 확인하고 서버 서비스 계정에 보고서 조회 권한을 부여합니다.</p>:<p>App Store Connect → 사용자 및 액세스 → 통합에서 보고서 조회용 API 키를 준비합니다. 개인 키는 서버 Secret Manager에만 저장하며 이 화면에 입력하지 않습니다.</p>}</details></div>}
  {!busy&&data?.status==='ready'&&<>
   {source==='analytics'&&summary&&<div className="reader-stats-metrics"><StatCard label="활성 사용자" value={Number(summary.activeUsers)} icon={<Users size={17}/>}/><StatCard label="새 사용자" value={Number(summary.newUsers)} hint="첫 실행 기준 · 재설치 등으로 스토어와 다를 수 있음"/><StatCard label="세션" value={Number(summary.sessions)} icon={<Activity size={17}/>}/><StatCard label="앱 참여 시간" value={secondsLabel(Number(summary.userEngagementDuration))} hint="독서 시간과 다른 지표"/></div>}
   {source!=='analytics'&&reports.daily&&<StatCard label={reports.daily.label} value={reports.daily.rows.length?reports.daily.rows.reduce((n,r)=>n+Number(r.installs??r.downloads??0),0):'보고서 대기'} icon={<Download size={17}/>} hint="제공된 날짜의 합계 · 보고서 지연 여부는 아래 안내 참고"/>}
   {reports.daily&&<StatsTrend report={reports.daily} metric={source==='analytics'?'activeUsers':source==='googlePlay'?'installs':'downloads'}/>}
   {source==='analytics'&&reports.reading&&<StatsTrend report={reports.reading} metric="customEvent:seconds" duration/>}
   <div className="reader-stats-grid">{Object.entries(reports).filter(([key])=>!['summary','daily','reading'].includes(key)).map(([key,report])=><StatsTable key={key} report={report}/>)}</div>
   {reports.daily?.note&&<p className="text-sm text-slate-500">{reports.daily.note}</p>}
   <p className="text-xs text-slate-500">조회 {new Date(data.fetchedAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'})} (한국 시간) · {data.cached?'저장된 보고서':'새 보고서'} · 서버 캐시 30분. 재조회해도 캐시 유효 기간에는 외부 API를 다시 호출하지 않습니다.</p>
  </>}
 </ReaderPageFrame></RoleGuard>;
}
