import type { Metadata } from "next";
import KoofyImagePages from "../../../components/legal/KoofyImagePages";
export const metadata: Metadata = { title: "쿠피 이미지 앱 소개 | Koofy Lab", alternates: { canonical: "/koofy-image/app" } };
export default function Page() { return <KoofyImagePages kind="app" />; }
