import type { Metadata } from "next";
import KoofyReaderLegalClient from "../../../components/legal/KoofyReaderLegalClient";

export const metadata: Metadata = { title: "쿠피리더 문의·광고 신고 | Koofy Lab", alternates: { canonical: "/koofy-reader/support" } };
export default function Page() { return <KoofyReaderLegalClient support />; }
