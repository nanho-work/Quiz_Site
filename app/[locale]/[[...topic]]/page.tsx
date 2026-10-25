import { notFound } from 'next/navigation';
import DiscoveryPage from '../../../components/discovery/DiscoveryPage';
import { locales, topics, pageMetadata, type Locale, type Topic } from '../../../lib/discovery';
export const dynamicParams = false;
export function generateStaticParams() { return locales.flatMap(locale => topics.map(topic => ({ locale, topic: topic ? topic.split('/') : [] }))); }
async function resolve(params: Promise<{ locale: string; topic?: string[] }>) {
  const value = await params;
  const topic = value.topic?.join('/') || '';
  if (!locales.includes(value.locale as Locale) || !topics.includes(topic as Topic)) notFound();
  return { locale: value.locale as Locale, topic: topic as Topic };
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string; topic?: string[] }> }) { const { locale, topic } = await resolve(params); return pageMetadata(locale, topic); }
export default async function Page({ params }: { params: Promise<{ locale: string; topic?: string[] }> }) { return <DiscoveryPage {...await resolve(params)} />; }
