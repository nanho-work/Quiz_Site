"use client";

import Link from "next/link";
import content from "../../lib/legal/koofyReaderPrivacy.json";
import { useLanguage } from "../LanguageProvider";
import PrivacyPolicyNav from "./PrivacyPolicyNav";

export default function KoofyReaderLegalClient({ support = false }: { support?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const locale = language === "ko" || language === "ja" ? language : "en";
  const document = content.translations[locale];
  const labels = {
    ko: {
      support: "쿠피리더 문의·광고 신고", privacy: "개인정보처리방침", contact: "문의·광고 신고",
      updated: "최종 업데이트", email: "대표 문의 메일",
      paragraphs: [
        "앱 이용 문의, 개인정보 관련 요청, 부적절한 광고 신고는 쿠피랩(Koofy Lab) 대표 메일로 보내 주세요.",
        "문의 제목에 ‘쿠피리더’를 적고 기기 종류·OS 버전, 발생 시각과 재현 방법을 알려 주세요. 광고 신고에는 독서 화면에서의 표시 위치와 광고 내용을 포함해 주세요.",
        "필요한 경우 직접 캡처를 첨부하되 개인정보나 책 본문은 가려 주세요. 로그인 정보나 비밀번호는 보내지 마세요.",
        "앱 설정 > 개인정보 및 광고에서도 광고 선택을 변경하거나 개인정보처리방침을 확인할 수 있습니다.",
        "문의 이메일과 첨부 자료는 Gmail로만 관리하며, 문의 처리 완료 후 1년 이내에 삭제합니다. 법령이 별도 보관을 요구하면 그 기간을 따릅니다.",
      ],
    },
    en: {
      support: "Koofy Reader Support & Ad Reports", privacy: "Privacy policy", contact: "Support & ad reports",
      updated: "Last updated", email: "Contact email",
      paragraphs: [
        "Contact Koofy Lab for app support, privacy requests or inappropriate ad reports.",
        "Include Koofy Reader in the subject, your device/OS, the time and steps to reproduce. For ad reports, include the placement in the reading viewer and describe the ad.",
        "You may attach a screenshot after removing personal information and book contents. Do not send passwords or login credentials.",
        "You can also review privacy information and advertising choices in the app under Settings > Privacy and advertising.",
        "Support email and attachments are managed only in Gmail and deleted within one year after the inquiry is resolved, unless a different retention period is required by law.",
      ],
    },
    ja: {
      support: "Koofy Reader お問い合わせ・広告の報告", privacy: "プライバシーポリシー", contact: "お問い合わせ・広告の報告",
      updated: "最終更新日", email: "お問い合わせメール",
      paragraphs: [
        "アプリの使い方、個人情報に関するご依頼、不適切な広告の報告は、Koofy Labのメール窓口へお送りください。",
        "件名に「Koofy Reader」と記入し、端末・OS、発生時刻と再現手順をお知らせください。広告の報告には、読書画面内の表示位置と広告の内容も含めてください。",
        "必要に応じてスクリーンショットを添付できますが、個人情報や本の本文は隠してください。パスワードやログイン情報は送信しないでください。",
        "アプリの「設定 > プライバシーと広告」でも広告の選択を変更し、プライバシーポリシーを確認できます。",
        "お問い合わせのメールと添付資料はGmailのみで管理し、対応完了後1年以内に削除します。法令により別の保存期間が定められる場合は、その期間に従います。",
      ],
    },
  }[locale];
  return <section className="mx-auto max-w-4xl">
    <PrivacyPolicyNav active="koofy-reader" />
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-3xl font-bold">{support ? labels.support : document.title}</h1>
      <nav aria-label="Language" className="flex gap-3">
        <button type="button" onClick={() => setLanguage("ko")} aria-pressed={locale === "ko"}>한국어</button>
        <button type="button" onClick={() => setLanguage("en")} aria-pressed={locale === "en"}>English</button>
        <button type="button" onClick={() => setLanguage("ja")} aria-pressed={locale === "ja"}>日本語</button>
      </nav>
    </div>
    <nav className="mb-8 flex flex-wrap gap-5 text-primary underline underline-offset-4">
      <Link href="/koofy-reader/privacy">{labels.privacy}</Link>
      <Link href="/koofy-reader/support">{labels.contact}</Link>
    </nav>
    {support ? <div className="space-y-5 leading-relaxed">
      {labels.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </div> : <>
      <p className="mb-4 text-sm text-muted-foreground">{labels.updated}: {content.updatedAt}</p>
      <p className="mb-8 leading-relaxed">{document.intro}</p>
      <div className="space-y-8">{document.sections.map(section => <section key={section.heading}>
        <h2 className="mb-3 text-xl font-semibold">{section.heading}</h2>
        {section.paragraphs.map(p => <p key={p} className="mt-3 leading-relaxed text-muted-foreground">{p}</p>)}
        {"links" in section && section.links?.map(link => <p key={link.href} className="mt-3"><a className="text-primary underline underline-offset-4" href={link.href} target="_blank" rel="noreferrer">{link.label}</a></p>)}
      </section>)}</div>
    </>}
    <div className="mt-10 rounded-xl border border-border p-5">
      <p className="mb-2 font-semibold">Koofy Lab · {labels.email}</p>
      <a className="break-all text-primary underline underline-offset-4" href={`mailto:${content.email}?subject=${encodeURIComponent(support ? "Koofy Reader Support" : "Koofy Reader Privacy")}`}>{content.email}</a>
    </div>
  </section>;
}
