import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "../../../components/marketing/Marketing";
import { getProducts, productSlugs } from "../../../lib/marketing";
export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProducts("ko").find((p) => p.slug === slug);
  if (!product) notFound();
  return {
    title: `${product.name} | Koofy Lab`,
    description: product.description,
    alternates: { canonical: product.href },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!productSlugs.includes(slug)) notFound();
  return <ProductPage slug={slug} />;
}
