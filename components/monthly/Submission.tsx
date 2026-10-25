'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../LanguageProvider';
import styles from './submission.module.css';
const email = 'koofylab@gmail.com';
const copy = {
  ko: {
    title: '당신의 이야기를 보내주세요', intro: '문득 떠오른 생각, 오래 기억하고 싶은 순간, 누군가에게 전하고 싶은 말. 짧은 글도 괜찮아요.',
    process: '보내주신 글은 쿠피랩에서 검토한 뒤, 선정된 글에 한해 이메일로 연락드립니다. 접수만으로 공개되지는 않으며 모든 글의 게재나 답변을 보장하지 않습니다.',
    guide: '한국어·영어·일본어로 직접 쓴 짧은 글을 보내주세요. 이미지는 첨부하지 않아도 됩니다. 실명 대신 공개할 필명을 쓰고, 다른 사람의 개인정보는 넣지 마세요.',
    subject: '[월간 쿠피 투고] 글 제목',
    template: '필명(게재 시 공개):\n글의 언어:\n글 제목:\n\n글 내용:\n\n\n아래 항목에 각각 답해주세요(예/아니오).\n1. 본인이 직접 작성하고 게재할 권리가 있는 글인가요?\n2. 선정 시 필명과 글을 월간 쿠피 앱·다운로드 합본에 게재하는 데 동의하나요?\n3. 한국어·영어·일본어로 번역하여 게재하는 데 동의하나요?\n4. 투고 검토 및 연락을 위한 이메일 주소·필명·본문 처리에 동의하나요?\n\n게재 전 수정 및 번역 범위는 이메일로 협의합니다.',
    privacy: '메일 주소·필명·본문은 Gmail로 받아 투고 검토와 연락에 사용하며, 처리 완료 후 1년 이내 삭제합니다. 선정된 글의 공개 기간과 이용 범위는 게재 전에 별도로 협의합니다. 동의하지 않으면 투고 접수가 어렵습니다. 철회·삭제 요청은 아래 이메일로 보내주세요.',
    send: '메일로 이야기 보내기', address: '이메일 주소 복사', form: '투고 양식 복사', heading: '투고 양식', notice: '버튼을 누르면 메일 앱이 열립니다. 내용을 작성한 뒤 직접 전송해야 접수됩니다. 메일 앱이 없다면 주소와 양식을 복사해서 사용하는 메일 서비스에서 보내주세요.', copied: '복사했어요.', failed: '복사하지 못했어요. 아래 내용을 직접 선택해 복사해 주세요.', policy: '개인정보처리방침',
  },
  en: {
    title: 'Share your story with us', intro: 'A passing thought, a moment worth remembering, or words for someone you care about. A short story is welcome.',
    process: 'Koofy Lab reviews submissions and contacts selected writers by email. Sending a story does not publish it. Publication and individual replies are not guaranteed.',
    guide: 'Send your own short writing in Korean, English, or Japanese. No image is required. Use a pen name for publication and leave out other people’s personal information.',
    subject: '[Monthly Koofy submission] Story title',
    template: 'Pen name (public if published):\nLanguage:\nTitle:\n\nStory:\n\n\nPlease answer each question (Yes/No).\n1. Did you write this work and do you have the right to submit it for publication?\n2. If selected, do you agree to publication of your pen name and work in Monthly Koofy in the app and downloadable collections?\n3. Do you agree to translated publication in Korean, English, and Japanese?\n4. Do you consent to processing your email address, pen name, and text for review and correspondence?\n\nEditing and translation will be discussed by email before publication.',
    privacy: 'We receive your email address, pen name, and text through Gmail for review and correspondence, and delete them within one year after handling is complete. Publication duration and usage will be agreed separately before publication. Consent is required to process a submission. Email us to withdraw consent or request deletion.',
    send: 'Send your story by email', address: 'Copy email address', form: 'Copy template', heading: 'Submission template', notice: 'This opens your email app. You must write and send the email yourself to submit. If no email app is configured, copy the address and template into your preferred email service.', copied: 'Copied.', failed: 'Could not copy. Please select and copy the text below.', policy: 'Privacy policy',
  },
  ja: {
    title: 'あなたの物語をお寄せください', intro: 'ふと浮かんだ思い、覚えておきたい瞬間、誰かに伝えたい言葉。短い文章も歓迎します。',
    process: 'Koofy Labが内容を確認し、掲載候補となった方にメールでご連絡します。送信だけで公開されることはありません。掲載や個別のお返事をお約束するものではありません。',
    guide: 'ご自身が書いた短い文章を韓国語・英語・日本語でお送りください。画像は不要です。公開用のペンネームを使い、他の方の個人情報は含めないでください。',
    subject: '[月刊Koofy 投稿] 作品タイトル',
    template: 'ペンネーム（掲載時に公開）:\n言語:\nタイトル:\n\n本文:\n\n\n各項目にお答えください（はい／いいえ）。\n1. ご自身が書き、掲載する権利を持つ文章ですか？\n2. 選ばれた場合、アプリ内の月刊Koofyとダウンロード合本への作品・ペンネームの掲載に同意しますか？\n3. 韓国語・英語・日本語に翻訳して掲載することに同意しますか？\n4. 確認と連絡のため、メールアドレス・ペンネーム・本文を取り扱うことに同意しますか？\n\n編集・翻訳の範囲は掲載前にメールで相談します。',
    privacy: 'メールアドレス・ペンネーム・本文をGmailで受け取り、確認と連絡に使用し、対応完了後1年以内に削除します。作品の公開期間と利用範囲は掲載前に別途相談します。同意がない場合は投稿を受け付けられません。同意の撤回・削除のご希望は下記メールへご連絡ください。',
    send: 'メールで物語を送る', address: 'メールアドレスをコピー', form: '投稿用紙をコピー', heading: '投稿用の書式', notice: 'メールアプリが開きます。内容を記入してご自身で送信すると受付となります。メールアプリがない場合は、アドレスと書式をコピーし、お使いのメールサービスから送ってください。', copied: 'コピーしました。', failed: 'コピーできませんでした。下の文章を選択してコピーしてください。', policy: 'プライバシーポリシー',
  },
};
export default function Submission() {
  const { language, setLanguage } = useLanguage();
  const [status, setStatus] = useState('');
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const lang = new URLSearchParams(window.location.search).get('lang');
    if (lang === 'ko' || lang === 'en' || lang === 'ja') setLanguage(lang);
  }, [setLanguage]);
  const locale = language === 'ko' || language === 'ja' ? language : 'en';
  const t = copy[locale];
  async function copyText(text: string) {
    try { await navigator.clipboard.writeText(text); setStatus(t.copied); }
    catch { setStatus(t.failed); }
  }
  return <article lang={locale} className={styles.page}>
    <p className={styles.brand}>MONTHLY KOOFY</p><h1>{t.title}</h1><p className={styles.intro}>{t.intro}</p>
    <p>{t.guide}</p><p>{t.process}</p>
    <div className={styles.actions}><a href={`mailto:${email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.template)}`}>{t.send} ↗</a><button onClick={() => copyText(email)}>{t.address}</button><button onClick={() => copyText(t.template)}>{t.form}</button></div>
    <p>{t.notice}</p><p><a href={`mailto:${email}`}>{email}</a></p><p role="status">{status}</p>
    <h2>{t.heading}</h2><pre className={styles.template}>{t.template}</pre>
    <aside className={styles.privacy}><p>{t.privacy}</p><Link href="/koofy-reader/privacy">{t.policy} →</Link></aside>
  </article>;
}
