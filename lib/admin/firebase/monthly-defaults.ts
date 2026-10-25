import type { ReaderMetadata } from './reader-api';

export const monthlyDefaults = {
  ko: { author: '쿠피랩', license: '쿠피랩이 제공하는 콘텐츠입니다. 개인적인 독서 목적으로 다운로드하여 이용할 수 있습니다. 무단 복제·재배포 및 상업적 이용은 허용하지 않습니다.' },
  en: { author: 'Koofy Lab', license: 'This content is provided by Koofy Lab. You may download it for personal reading. Unauthorized copying, redistribution, and commercial use are not permitted.' },
  ja: { author: 'Koofy Lab', license: 'このコンテンツはKoofy Labが提供しています。個人での読書を目的としてダウンロード・利用できます。無断での複製・再配布および商用利用は禁止されています。' },
};

export function monthlyLanguageFields(form: ReaderMetadata, language = form.language || 'ko'): ReaderMetadata {
  const defaults = monthlyDefaults[language];
  const license = form.license.trim();
  return { ...form, language, author: defaults.author,
    license: !license || Object.values(monthlyDefaults).some(value => value.license === license) ? defaults.license : form.license };
}
