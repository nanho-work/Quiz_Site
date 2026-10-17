"use client";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider";
import content from "../../lib/legal/koofyImageContent.json";

import PrivacyPolicyNav from "./PrivacyPolicyNav";

type PageKind = "app" | "privacy" | "support";
export default function KoofyImagePages({ kind }: { kind: PageKind }) {
  const { language, setLanguage } = useLanguage();
  const lang = language === "ko" || language === "ja" ? language : "en";
  const c = content.copy[lang];
  const text = (value: string) => value.replace(/\*\*/g, "").replace(/^> /gm, "");
  return <section lang={lang} className="mx-auto max-w-5xl">
    {kind==='privacy' && <PrivacyPolicyNav active="koofy-image" />}
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <Link href="/koofy-image/app" className="text-xl font-bold">{c.name}</Link>
      <nav aria-label={c.lang} className="flex gap-2">
        {([['ko','한국어'],['en','English'],['ja','日本語']] as const).map(([code,label]) =>
          <button key={code} type="button" onClick={() => setLanguage(code)} aria-pressed={lang===code}
            className="rounded-full border border-border px-4 py-2 aria-pressed:bg-muted">{label}</button>)}
      </nav>
    </div>
    <nav aria-label="Koofy Image" className="mb-8 flex flex-wrap gap-5 text-primary underline underline-offset-4">
      {(['app','privacy','support'] as const).map(key => <Link key={key} href={'/koofy-image/'+key} aria-current={kind===key?'page':undefined}>{c[key]}</Link>)}
    </nav>
    <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{kind==='app'?c.title.join(' '):c[kind]}</h1>
    {kind==='app'?<>
      <p className="mt-5 text-xl text-muted-foreground">{c.desc}</p>
      {/* Static editorial asset, not a user photo or external image request. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={'/products/koofy-image/'+lang+'/web-social-1200x630.png'} alt={c.sub} width={1200} height={630} className="my-8 h-auto w-full rounded-2xl" />
      <Link href="/koofy-image" className="inline-flex rounded-full bg-sky-100 px-6 py-3 font-semibold text-slate-700">{c.cta}</Link>
      <p className="mt-4 text-sm text-muted-foreground">{c.draft}</p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">{c.features.map((title,i)=><section key={title}><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 text-muted-foreground">{c.details[i]}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={'/products/koofy-image/'+lang+'/'+['03-convert-options.png','08-compressed.png','09-saved.png'][i]} alt={title} width={1080} height={2400} className="mt-5 h-auto w-full rounded-xl border border-border" />
        </section>)}</div><p className="mt-5 text-sm text-muted-foreground">{c.screenNote}</p>
    </>:<article className="mt-8 max-w-3xl space-y-5 leading-relaxed">
      {content.legal[lang][kind].map((b,i)=>b.type==='h2'?<h2 key={i} className="pt-5 text-xl font-semibold">{text(b.text)}</h2>:<p key={i} className="whitespace-pre-wrap break-words text-muted-foreground">{text(b.text)}</p>)}
          {kind==='privacy' && <p><a className="text-primary underline underline-offset-4" href={'https://policies.google.com/privacy?hl='+lang}>{lang==='ko'?'Google 개인정보처리방침':lang==='ja'?'Google プライバシーポリシー':'Google Privacy Policy'}</a> · <Link className="text-primary underline underline-offset-4" href="/privacy">{lang==='ko'?'웹사이트 개인정보처리방침':lang==='ja'?'ウェブサイトのプライバシーポリシー':'Website privacy policy'}</Link></p>}
    </article>}
    <footer className="mt-12 border-t border-border pt-6 text-sm">쿠피랩 · <a className="underline underline-offset-4" href="mailto:koofylab@gmail.com">koofylab@gmail.com</a></footer>
  </section>;
}
