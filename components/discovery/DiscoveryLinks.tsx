'use client';
import Link from 'next/link';
import { useLanguage } from '../LanguageProvider';
import { article, labels, pathFor, topics } from '../../lib/discovery';
import styles from './discovery.module.css';
export default function DiscoveryLinks() {
  const { language } = useLanguage();
  const locale = language === 'ko' || language === 'ja' ? language : 'en';
  return <section lang={locale} className={`${styles.page} ${styles.related}`}>
    <h2><Link href={pathFor(locale)}>{labels[locale].home} →</Link></h2>
    <p style={{ marginBottom: 20 }}>{article(locale, '').summary}</p>
    <div className={styles.grid}>{topics.filter(topic => topic).map(topic => <Link key={topic} href={pathFor(locale, topic)}>{article(locale, topic).title} →</Link>)}</div>
    <nav className={styles.languages} aria-label="Language" style={{ marginTop: 24 }}><Link href="/ko" hrefLang="ko">한국어</Link><Link href="/en" hrefLang="en">English</Link><Link href="/ja" hrefLang="ja">日本語</Link></nav>
  </section>;
}
