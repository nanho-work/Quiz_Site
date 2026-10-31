import type { ReaderMetadata } from './reader-api';

export const contentLicenses = {
  "ko": "쿠피랩에서 제공하는 읽기 콘텐츠입니다. 개인적인 독서 목적으로 다운로드하여 이용할 수 있습니다. 원작·번역·삽화의 권리는 각 권리자에게 있으며, 저작권이 만료된 원작의 자유로운 이용은 제한하지 않습니다.",
  "en": "Reading content provided by Koofy Lab. You may download it for personal reading. Rights in the original text, translation, and illustrations belong to their respective rights holders. This notice does not restrict the use of public-domain originals.",
  "ja": "Koofy Labが提供する読書コンテンツです。個人での読書を目的としてダウンロード・利用できます。原文・翻訳・挿絵の権利は各権利者に帰属します。著作権保護期間が満了した原作の自由な利用を制限するものではありません。"
};
export function contentLicense(value: string | undefined, language: 'ko' | 'en' | 'ja') {
 const text = value?.trim() || '';
 return !text || Object.values(contentLicenses).includes(text) ? contentLicenses[language] : text;
}
export const monthlyDefaults = {
 ko: { author: '쿠피랩', license: contentLicenses.ko },
 en: { author: 'Koofy Lab', license: contentLicenses.en },
 ja: { author: 'Koofy Lab', license: contentLicenses.ja },
};

export function monthlyLanguageFields(form: ReaderMetadata, language = form.language || 'ko'): ReaderMetadata {
  const defaults = monthlyDefaults[language];
  const license = form.license.trim();
  return { ...form, language, author: defaults.author,
    license: !license || Object.values(monthlyDefaults).some(value => value.license === license) ? defaults.license : form.license };
}

/** Titles are derived from the issue month, never from the browser locale. */
export function monthlyTitle(issueMonth: string, language: 'ko' | 'en' | 'ja' = 'ko'): string {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(issueMonth)) return '';
  const [year, month] = issueMonth.split('-');
  const number = Number(month);
  if (language === 'ja') return `月刊クーフィー ${year}年${number}月号`;
  if (language === 'en') return `Koofy Monthly — ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][number - 1]} ${year}`;
  return `월간 쿠피 ${year}년 ${number}월호`;
}

export function monthlyIssueFields(form: ReaderMetadata, issueMonth: string, language = form.language || 'ko'): ReaderMetadata {
  const automatic = !form.title.trim() || form.title === monthlyTitle(form.issueMonth || '', form.language || 'ko');
  return { ...monthlyLanguageFields(form, language), issueMonth, compilationId: '', releaseDate: '', releaseAt: '',
    title: automatic ? monthlyTitle(issueMonth, language) : form.title };
}
