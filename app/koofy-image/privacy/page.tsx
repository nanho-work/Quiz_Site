import type { Metadata } from "next";
import KoofyImagePages from "../../../components/legal/KoofyImagePages";
export const metadata: Metadata = { title: "쿠피 이미지 개인정보처리방침 | Koofy Lab", alternates: { canonical: "/koofy-image/privacy" } };
export default function Page() { return <KoofyImagePages kind="privacy" />; }
