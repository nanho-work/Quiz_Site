import type {ReactNode} from 'react';
export const readerButton='reader-button';
export const readerPrimaryButton='reader-button reader-button-primary';
/** One status vocabulary throughout book lists, translation panels and episode tables. */
export function ReaderStatus({value}:{value:string}) {
 let tone='neutral';
 if(/실패|오류/.test(value))tone='danger';
 else if(/중$|중 ·/.test(value)&&!/공개 중/.test(value))tone='working';
 else if(/미저장|변경사항/.test(value))tone='warning';
 else if(/예약/.test(value))tone='info';
 else if(/공개 중|공개된|공개 완료/.test(value))tone='success';
 const [label,...detail]=value.split(' · ');
 return <span className="reader-status" data-tone={tone}><span className="reader-status-badge"><span className="reader-status-dot" aria-hidden="true"/>{label==='임시 저장'?'초안':label==='공개 예약'||label==='예약 공개 완료'?'예약':label}</span>{detail.length>0&&<span className="reader-status-detail">{detail.join(' · ')}</span>}</span>;
}
export function ReaderSectionHeading({title,description,children}:{title:string;description?:string;children?:ReactNode}) {
 return <div className="reader-section-heading"><div><h2>{title}</h2>{description&&<p>{description}</p>}</div>{children}</div>;
}

/** Shared page geometry: screens supply actions and content, never their own width. */
export function ReaderPageFrame({toolbar,children}:{toolbar:ReactNode;children:ReactNode}) {
 return <main className="reader-page-frame text-slate-100">
  <header className="reader-page-toolbar">{toolbar}</header>
  <div className="reader-page-content">{children}</div>
 </main>;
}
