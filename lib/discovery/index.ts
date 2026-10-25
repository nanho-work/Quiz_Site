import type { Metadata } from 'next';
import content from './content.json';
export const locales = ['ko', 'en', 'ja'] as const;
export type Locale = typeof locales[number];
export const topics = ['', 'koofy-reader', 'koofy-image', 'guides/read-txt-epub', 'guides/heic-to-jpg', 'guides/reduce-photo-size'] as const;
export type Topic = typeof topics[number];
export const origin = 'https://www.koofy.co.kr';
export const localeNames = { ko: '한국어', en: 'English', ja: '日本語' };
export const labels = {
  ko: { home: '제품 및 사용 가이드', steps: '이렇게 사용하세요', related: '함께 보면 좋은 안내', reader: '쿠피리더', image: '쿠피 이미지 웹 도구 열기', app: '쿠피 이미지 앱 소개', support: '고객지원', privacy: '개인정보처리방침' },
  en: { home: 'Products and guides', steps: 'Step by step', related: 'Explore more guides', reader: 'Koofy Reader', image: 'Open Koofy Image web', app: 'About the Koofy Image app', support: 'Support', privacy: 'Privacy policy' },
  ja: { home: '製品と使い方ガイド', steps: '操作手順', related: '関連ガイド', reader: 'Koofy Reader', image: 'Koofy Imageウェブを開く', app: 'Koofy Imageアプリの紹介', support: 'サポート', privacy: 'プライバシーポリシー' },
};
export function pathFor(locale: Locale, topic: Topic = '') { return `/${locale}${topic ? '/' + topic : ''}`; }
export function article(locale: Locale, topic: Topic) {
  const [title, summary, sections, steps] = content[locale][topic] as [string, string, [string, string][], string[]];
  return { title, summary, sections, steps };
}
export function pageMetadata(locale: Locale, topic: Topic): Metadata {
  const { title, summary } = article(locale, topic);
  const url = origin + pathFor(locale, topic);
  return {
    title, description: summary,
    alternates: { canonical: url, languages: { ...Object.fromEntries(locales.map(code => [code, origin + pathFor(code, topic)])), 'x-default': origin + pathFor('en', topic) } },
    openGraph: { title, description: summary, url, siteName: '쿠피랩 · Koofy Lab', type: 'website', locale: { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP' }[locale], alternateLocale: locales.filter(code => code !== locale).map(code => ({ ko: 'ko_KR', en: 'en_US', ja: 'ja_JP' })[code]), images: [{ url: '/KoofyLab_Banner.png', width: 1536, height: 1024, alt: 'Koofy Lab' }] },
    twitter: { card: 'summary_large_image', title, description: summary, images: ['/KoofyLab_Banner.png'] },
  };
}
export const brandSchema = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': origin + '/#organization', name: 'Koofy Lab', alternateName: ['쿠피랩', '쿠피', 'Koofy'], url: origin + '/', logo: origin + '/KoofyLab2.png', email: 'koofylab@gmail.com' },
    { '@type': 'WebSite', '@id': origin + '/#website', name: '쿠피랩', alternateName: ['쿠피', 'Koofy Lab', 'Koofy'], url: origin + '/', inLanguage: [...locales], publisher: { '@id': origin + '/#organization' } },
  ],
};
export function pageSchema(locale: Locale, topic: Topic) {
  const { title, summary } = article(locale, topic);
  const url = origin + pathFor(locale, topic);
  const reader = topic === 'koofy-reader';
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': topic.startsWith('guides/') ? 'TechArticle' : 'WebPage', '@id': url + '#page', url, headline: title, name: title, description: summary, inLanguage: locale, isPartOf: { '@id': origin + '/#website' }, publisher: { '@id': origin + '/#organization' } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: labels[locale].home, item: origin + pathFor(locale) },
      ...(topic ? [{ '@type': 'ListItem', position: 2, name: title, item: url }] : []),
    ] },
    ...(topic === 'koofy-reader' || topic === 'koofy-image' ? [{ '@type': reader ? 'MobileApplication' : 'WebApplication', name: reader ? 'Koofy Reader' : 'Koofy Image Web', url, description: summary, applicationCategory: reader ? 'ReferenceApplication' : 'MultimediaApplication', operatingSystem: reader ? 'iOS, Android' : 'Web browser', publisher: { '@id': origin + '/#organization' } }] : []),
  ] };
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
