import type { Metadata } from "next";
import { ProductsPage } from "../../components/marketing/Marketing";
export const metadata: Metadata = {
  title: "제품 | Koofy Lab",
  description:
    "쿠피리더, Bus Pop 등 쿠피의 앱과 게임, 웹사이트 제작 사례를 만나보세요.",
  alternates: { canonical: "/products" },
};
export default function Page() {
  return <ProductsPage />;
}
