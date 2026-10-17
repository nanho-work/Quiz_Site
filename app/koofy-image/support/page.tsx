import type { Metadata } from "next";
import KoofyImagePages from "../../../components/legal/KoofyImagePages";
export const metadata: Metadata = { title: "쿠피 이미지 고객지원 | Koofy Lab", alternates: { canonical: "/koofy-image/support" } };
export default function Page() { return <KoofyImagePages kind="support" />; }
