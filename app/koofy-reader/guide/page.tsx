import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./guide.css";

export const metadata: Metadata = {
  title: "쿠피리더 사용 가이드 — 표지 일괄 등록·글꼴·TTS",
  description: "쿠피리더 화면으로 따라 하는 사용법. TXT·EPUB 가져오기, 같은 파일명으로 표지 연결, 개인 글꼴 추가, 독서 설정, TTS와 번역을 안내합니다.",
  alternates: { canonical: "/koofy-reader/guide" },
  openGraph: { title: "쿠피리더, 이렇게 사용하세요", description: "표지 연결부터 내 글꼴과 듣기까지, 화면으로 따라 하는 사용 가이드.", url: "/koofy-reader/guide", locale: "ko_KR", images: [{url:"/products/reader-library.webp"}] },
};
type Mark = { x: number; y: number; w: number; h: number; label: string };
function Screen({ name, title, marks, native = false }: { name: string; title: string; marks: Mark[]; native?: boolean }) {
  return <figure className="guide-figure">
    <a className="guide-screen" href={`/products/guide/${name}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`${title} 원본 크게 보기 (새 탭)`}>
      <Image src={`/products/guide/${name}.webp`} alt={title} width={native ? 1080 : 880} height={native ? 2340 : 1912} sizes="(max-width: 700px) 85vw, 340px" />
      {marks.map((m,i)=><span className="guide-mark" key={m.label} aria-hidden="true" style={{left:`${m.x}%`,top:`${m.y}%`,width:`${m.w}%`,height:`${m.h}%`}}><b>{i+1}</b></span>)}
    </a>
    <figcaption>{title} · 누르면 원본 확대 ↗</figcaption>
  </figure>;
}
const topics = [ ["import","책 가져오기"], ["covers","표지 자동 연결"], ["fonts","내 글꼴"], ["reading","독서 설정"], ["listening","음성 듣기"], ["translation","문장 번역"] ];
function Steps({items}:{items:string[]}) {return <ol className="guide-steps">{items.map(s=><li key={s}>{s}</li>)}</ol>}
export default function GuidePage(){return <article className="reader-manual" lang="ko">
  <Link href="/koofy-reader" className="guide-back">← 쿠피리더 소개</Link>
  <header className="guide-intro"><p className="guide-kicker">KOOFY READER / USER GUIDE</p><h1>내 책을 더 편하게.<br/><em>화면으로 따라 해 보세요.</em></h1><p>책을 가져오는 첫 순간부터 나에게 맞는 글꼴과 목소리까지.<br/>이미지 속 번호를 따라 하나씩 설정해 보세요.</p></header>
  <aside className="guide-version"><strong>화면·버전 안내</strong><p>2026.09.30 · 한국어 앱 1.3.3 개발 화면과 예시 도서로 촬영했습니다. 개인 글꼴과 새 독서 설정은 해당 버전에서 제공되며, 아직 배포되지 않은 스토어에서는 메뉴가 다를 수 있습니다. Android와 iOS의 화면 모양도 일부 다릅니다.</p></aside>
  <nav className="guide-index" aria-label="사용 가이드 목차">{topics.map(([id,t],i)=><a key={id} href={`#${id}`}><span>0{i+1}</span>{t}<span aria-hidden="true">↗</span></a>)}</nav>

  <section id="import" className="guide-section"><div className="guide-copy"><p className="guide-kicker">01 / MY LIBRARY</p><h2>여러 권도,<br/>한 번에 가져오세요.</h2><p>기기에 있는 TXT·EPUB 파일을 내 서재에 추가합니다. 이미 가져온 책은 검색으로 빠르게 찾을 수 있어요.</p><Steps items={["‘책 가져오기’를 누르고 파일 선택 창에서 여러 책을 선택하세요. 기기의 파일 앱에 따라 선택 방식은 다를 수 있습니다.","이미 서재에 있는 책의 표지를 연결하려면 ‘표지 일괄 등록’을 누르세요."]}/><details><summary>책 파일을 준비할 때</summary><p>일반 텍스트와 텍스트 중심의 리플로우 EPUB을 지원합니다. DRM 보호·고정 레이아웃 EPUB은 지원하지 않습니다. 원본 파일은 따로 보관해 주세요.</p></details></div><Screen name="guide-library" title="서재의 책 가져오기와 표지 일괄 등록" marks={[{x:65,y:39.5,w:31,h:5.3,label:"책 가져오기"},{x:29,y:39.5,w:32,h:5.3,label:"표지 일괄 등록"}]}/></section>

  <section id="covers" className="guide-section"><div className="guide-copy"><p className="guide-kicker">02 / COVER MATCHING</p><h2>이름을 맞추면,<br/>표지도 한꺼번에.</h2><p>각 회차마다 이미지를 하나씩 지정할 필요가 없습니다. 책과 이미지의 <strong>확장자를 뺀 원래 파일명</strong>을 같게 준비하세요.</p><div className="guide-file-pair"><code>숲의 문장들_001.txt</code><span>＋</span><code>숲의 문장들_001.jpg</code></div><Steps items={["연결 목록에서 책과 이미지가 맞는지 확인하세요. 같은 이름이 여러 개라면 직접 선택할 수 있습니다.","‘표지 적용’을 누르면 선택한 책들에 반영됩니다."]}/><details><summary>기존 표지와 이름이 겹치면?</summary><p>‘기존 표지도 교체’를 끄면 이미 등록한 표지는 유지합니다. 앱에 표시되는 책 제목이 아니라 원래 파일명을 비교합니다. 영문 대소문자와 이름 양끝 공백은 무시합니다. 묶음 안에서 실행하면 해당 묶음에만 연결합니다. 원래 파일명 정보가 없는 이전 백업의 책은 개별 등록을 이용하세요.</p></details></div><Screen name="guide-covers" title="파일명으로 연결된 세 권의 표지 확인 화면" marks={[{x:4,y:25,w:92,h:15,label:"연결 목록"},{x:3,y:93,w:94,h:5.5,label:"표지 적용"}]}/></section>

  <section id="fonts" className="guide-section"><div className="guide-copy"><p className="guide-kicker">03 / YOUR TYPE</p><span className="guide-new">1.3.3 새 기능</span><h2>좋아하는 글꼴로<br/>읽는 즐거움.</h2><p>독서 설정 → 보기 → 글꼴·문단 설정 → <strong>내 글꼴 추가·관리</strong>로 이동하세요.</p><Steps items={["‘내 글꼴 추가’에서 기기의 TTF·OTF 파일을 선택하세요. 파일당 10MB 이하, 최대 50개까지 보관합니다.","이름이 실제 글꼴 모양으로 표시됩니다. 원하는 글꼴을 선택하면 모든 책의 독서 설정에 적용됩니다."]}/><details><summary>다운로드 글꼴과 개인 글꼴의 차이</summary><p>제공되는 글꼴은 서재의 ‘도서·글꼴 다운로드 → 글꼴’에서 내려받고, 독서 설정에서 선택합니다. 개인 글꼴은 직접 보관한 TTF·OTF 파일을 추가합니다. 휴대폰 설정에 설치된 모든 글꼴을 자동으로 가져오지는 않습니다. 사용 중인 개인 글꼴을 삭제하면 기본 글꼴로 돌아갑니다.</p></details></div><Screen name="guide-fonts" title="글꼴 파일 추가와 실제 글꼴 미리보기" marks={[{x:4,y:13.5,w:92,h:5.5,label:"내 글꼴 추가"},{x:4,y:19,w:92,h:11.5,label:"글꼴 선택"}]}/></section>

  <section id="reading" className="guide-section"><div className="guide-copy"><p className="guide-kicker">04 / READING COMFORT</p><span className="guide-new">1.3.3 설정 화면</span><h2>자주 바꾸는 설정은<br/>가까이 두었습니다.</h2><p>책 화면에서 ‘독서 설정’을 열어 주세요. 보기·듣기·번역을 나눠 필요한 설정을 찾기 쉽게 만들었습니다.</p><Steps items={["‘보기’에서 글자 크기, 배경, 페이지 넘김·연속 스크롤을 선택하세요.","글꼴과 줄 간격 등 세부 조절은 아래의 ‘글꼴·문단 설정’을 펼치세요."]}/><details><summary>두 페이지 보기와 표지는 어떻게 되나요?</summary><p>두 페이지 선택은 충분히 넓은 화면에서 표시됩니다. ‘자동’을 사용하면 가용 화면 폭에 맞춰 배치가 바뀝니다. 표지 표시를 켠 책은 두 페이지 배치에서 등록한 표지가 왼쪽, 본문이 오른쪽에 이어집니다. EPUB 자체 표지가 있는 경우 원래 구성을 유지할 수 있습니다.</p></details><Link className="guide-detail-link" href="/products/reader-wide.webp" target="_blank" rel="noopener noreferrer">기존 넓은 화면 예시 보기 ↗</Link></div><Screen native name="guide-settings" title="보기·듣기·번역으로 나뉜 독서 설정" marks={[{x:7,y:22.5,w:86,h:6,label:"설정 탭"},{x:7,y:89,w:86,h:6,label:"글꼴·문단 설정"}]}/></section>

  <section id="listening" className="guide-section"><div className="guide-copy"><p className="guide-kicker">05 / LISTEN</p><h2>눈이 쉬는 동안,<br/>목소리로 이어서.</h2><p>기기에 설치된 로컬 음성으로 책을 읽어 줍니다. 제공되는 목소리와 자연스러움은 기기·음성 엔진에 따라 다릅니다.</p><Steps items={["‘듣기 시작 / 재개’를 눌러 본문 읽기를 시작하세요.","‘목소리·속도·타이머’에서 음성을 선택하고 미리 들으며 조절하세요."]}/><details><summary>재생 버튼과 멈춤 동작</summary><p>새 설정에서는 듣기를 시작하면 조작 버튼이 나타나고, 일시정지 중에는 유지됩니다. ‘듣기 종료’를 누르면 숨겨집니다. 계속 보고 싶으면 ‘듣기 버튼 항상 표시’를 켜세요. 서재로 나가거나 앱이 백그라운드로 이동하면 재생은 멈춥니다. 다시 돌아와도 자동으로 재생하지 않습니다.</p></details></div><Screen native name="guide-listening" title="듣기 시작과 목소리·속도·타이머 설정" marks={[{x:7,y:66,w:86,h:5.8,label:"듣기 시작"},{x:7,y:71.7,w:86,h:5.8,label:"음성 설정"}]}/></section>

  <section id="translation" className="guide-section"><div className="guide-copy"><p className="guide-kicker">06 / UNDERSTAND</p><h2>모르는 문장은<br/>길게 눌러 보세요.</h2><p>영문 책을 읽다가 뜻이 궁금할 때, 선택한 단어나 문장을 한국어로 확인할 수 있습니다.</p><Steps items={["독서 설정의 ‘번역’에서 번역 모드를 켜세요.","설정을 닫고 본문을 길게 눌러 단어나 문장을 선택하세요. 결과는 아래쪽 번역 영역에 나타납니다."]}/><details><summary>처음 사용할 때 알아둘 점</summary><p>최초 사용에는 번역 모델 다운로드를 위한 인터넷 연결이 필요합니다. 모델 준비 후에는 기기에서 번역합니다. 선택 중에는 페이지 넘김과 충돌하지 않도록 동작이 달라집니다. 번역을 마치면 모드를 꺼 평소 독서로 돌아가세요.</p></details></div><Screen native name="guide-translation" title="번역 모드 켜기와 본문 선택 안내" marks={[{x:7,y:83,w:86,h:6,label:"번역 모드"},{x:7,y:89,w:86,h:6,label:"선택 안내"}]}/></section>

  <section className="guide-more"><p className="guide-kicker">MORE TO KNOW</p><h2>이것도 알아두세요.</h2><details><summary>책을 묶거나 잘못 묶은 책을 꺼내려면?</summary><p>서재의 묶음 만들기와 책·묶음의 더보기 메뉴를 이용하세요. 묶음은 여러 파일을 하나의 본문으로 합치는 기능이 아닙니다. 묶음에서 책을 꺼내는 동작과 책 파일 삭제는 다르므로 메뉴를 확인해 주세요.</p></details><details><summary>시나 회차를 새 페이지에서 시작하려면?</summary><p>TXT에서 새 작품이나 장의 제목 앞에 [장] 표시를 사용하세요. 예를 들어 ‘[장] 제1화’처럼 작성합니다. 자세한 작성 규칙은 앱에 포함된 사용 설명서의 장 구분 안내에서 확인할 수 있습니다.</p></details><details><summary>기기를 바꾸기 전에 준비할 것은?</summary><p>설정의 백업·복원 기능으로 백업 파일을 만들고 안전한 곳에 보관하세요. 복원 후 책과 읽던 위치를 확인한 다음 기존 기기를 정리하는 것이 좋습니다.</p></details><Link className="guide-detail-link" href="/koofy-reader/support">도움이 더 필요하신가요? 문의하기 ↗</Link></section>
</article>}
