import type { Metadata } from "next";
import { AdminAuthProvider } from "../../components/admin/auth/AdminAuthProvider";
import { AdminShell } from "../../components/admin/layout/AdminShell";

export const metadata: Metadata = {
  title: "KoofyLab Admin",
  description: "KoofyLab 서비스 운영 콘솔",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
