import Link from 'next/link';
import Image from 'next/image';
import { article, labels, locales, localeNames, pathFor, pageSchema, jsonLd, topics, type Locale, type Topic } from '../../lib/discovery';
import { readerAppStoreUrl, readerGooglePlayUrl } from '../../lib/marketing';
import styles from './discovery.module.css';

export default function DiscoveryPage({ locale, topic }: { locale: Locale; topic: Topic }) {
  const text = article(locale, topic);
  const words = labels[locale];
  const reader = topic === 'koofy-reader' || topic === 'guides/read-txt-epub';
  return <article lang={locale} className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(pageSchema(locale, topic)) }} />
    <nav className={styles.languages} aria-label="Language">
      {locales.map(code => <Link href={pathFor(code, topic)} hrefLang={code} lang={code} aria-current={code === locale ? 'page' : undefined} key={code}>{localeNames[code]}</Link>)}
    </nav>
    {topic && <Link href={pathFor(locale)} className={styles.back}>← {words.home}</Link>}
    <header className={styles.hero}>
      <p className={styles.brand}>쿠피 · KOOFY LAB</p>
      <h1>{text.title}</h1><p>{text.summary}</p>
      {topic && <div className={styles.actions}>
        {reader ? <><a href={readerAppStoreUrl}>App Store ↗</a><a href={readerGooglePlayUrl}>Google Play ↗</a></> : <><Link href="/koofy-image">{words.image} →</Link><Link href="/koofy-image/app">{words.app} →</Link></>}
      </div>}
    </header>
    <div className={styles.body}>
      {topic && <Image src={reader ? '/products/reader-wide.webp' : `/products/koofy-image/${locale}/web-social-1200x630.png`} alt={reader ? 'Koofy Reader' : 'Koofy Image'} width={reader ? 1032 : 1200} height={reader ? 1376 : 630} className={styles.image} />}
      <div>
        {text.steps.length > 0 && <section><h2>{words.steps}</h2><ol>{text.steps.map(step => <li key={step}>{step}</li>)}</ol></section>}
        {text.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
        {topic && <p className={styles.support}><Link href={reader ? '/koofy-reader/support' : '/koofy-image/support'}>{words.support}</Link><Link href={reader ? '/koofy-reader/privacy' : '/koofy-image/privacy'}>{words.privacy}</Link></p>}
      </div>
    </div>
    <section className={styles.related}><h2>{words.related}</h2><div className={styles.grid}>{topics.filter(key => key && key !== topic).map(key => <Link href={pathFor(locale, key)} key={key}><h3>{article(locale, key).title}</h3><p>{article(locale, key).summary}</p><span aria-hidden="true">↗</span></Link>)}</div></section>
  </article>;
}
