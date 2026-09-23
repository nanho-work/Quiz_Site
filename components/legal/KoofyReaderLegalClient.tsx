"use client";

import Link from "next/link";
import content from "../../lib/legal/koofyReaderPrivacy.json";
import { useLanguage } from "../LanguageProvider";
import PrivacyPolicyNav from "./PrivacyPolicyNav";

export default function KoofyReaderLegalClient({ support = false }: { support?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const ko = language === "ko";
  const document = ko ? content.translations.ko : content.translations.en;
  return <section className="mx-auto max-w-4xl">
    <PrivacyPolicyNav active="koofy-reader" />
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-3xl font-bold">{support ? (ko ? "쿠피리더 문의·광고 신고" : "Koofy Reader Support & Ad Reports") : document.title}</h1>
      <nav aria-label="Language" className="flex gap-3">
        <button type="button" onClick={() => setLanguage("ko")} aria-pressed={ko}>한국어</button>
        <button type="button" onClick={() => setLanguage("en")} aria-pressed={!ko}>English</button>
      </nav>
    </div>
    <nav className="mb-8 flex flex-wrap gap-5 text-primary underline underline-offset-4">
      <Link href="/koofy-reader/privacy">{ko ? "개인정보처리방침" : "Privacy policy"}</Link>
      <Link href="/koofy-reader/support">{ko ? "문의·광고 신고" : "Support & ad reports"}</Link>
    </nav>
    {support ? <div className="space-y-5 leading-relaxed">
      <p>{ko ? "앱 이용 문의, 개인정보 관련 요청, 부적절한 광고 신고는 Koofy Lab 대표 메일로 보내 주세요." : "Contact Koofy Lab for app support, privacy requests or inappropriate ad reports."}</p>
      <p>{ko ? "문의 제목에 ‘쿠피리더’를 적고 기기 종류·OS 버전, 발생 시각과 재현 방법을 알려 주세요. 광고 신고에는 서재/독서 화면 등 광고 위치와 광고 내용을 포함해 주세요." : "Include Koofy Reader in the subject, your device/OS, the time and steps to reproduce. For ad reports, include the placement (library or reader) and describe the ad."}</p>
      <p>{ko ? "필요한 경우 직접 캡처를 첨부하되 개인정보나 책 본문은 가려 주세요. 로그인 정보나 비밀번호는 보내지 마세요." : "You may attach a screenshot after removing personal information and book contents. Do not send passwords or login credentials."}</p>
      <p>{ko ? "앱 설정 > 개인정보 및 광고에서도 광고 선택을 변경하거나 개인정보처리방침을 확인할 수 있습니다." : "You can also review privacy information and advertising choices in the app under Settings > Privacy and advertising."}</p>
    </div> : <>
      <p className="mb-4 text-sm text-muted-foreground">{ko ? "최종 업데이트" : "Last updated"}: {content.updatedAt}</p>
      <p className="mb-8 leading-relaxed">{document.intro}</p>
      <div className="space-y-8">{document.sections.map(section => <section key={section.heading}>
        <h2 className="mb-3 text-xl font-semibold">{section.heading}</h2>
        {section.paragraphs.map(p => <p key={p} className="mt-3 leading-relaxed text-muted-foreground">{p}</p>)}
        {"links" in section && section.links?.map(link => <p key={link.href} className="mt-3"><a className="text-primary underline underline-offset-4" href={link.href} target="_blank" rel="noreferrer">{link.label}</a></p>)}
      </section>)}</div>
    </>}
    <div className="mt-10 rounded-xl border border-border p-5">
      <p className="mb-2 font-semibold">Koofy Lab · {ko ? "대표 문의 메일" : "Contact email"}</p>
      <a className="break-all text-primary underline underline-offset-4" href={`mailto:${content.email}?subject=${encodeURIComponent(support ? "Koofy Reader Support" : "Koofy Reader Privacy")}`}>{content.email}</a>
    </div>
  </section>;
}
