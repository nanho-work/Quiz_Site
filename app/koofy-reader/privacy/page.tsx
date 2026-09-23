import type { Metadata } from "next";
import KoofyReaderLegalClient from "../../../components/legal/KoofyReaderLegalClient";

export const metadata: Metadata = { title: "쿠피리더 개인정보처리방침 | Koofy Lab", alternates: { canonical: "/koofy-reader/privacy" } };
export default function Page() { return <KoofyReaderLegalClient />; }
