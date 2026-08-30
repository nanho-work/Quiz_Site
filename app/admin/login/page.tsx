"use client";

import { Chrome, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminErrorMessage } from "../../../lib/admin/firebase/admin-api";
import { hasAnyAdminRole, useAdminAuth } from "../../../components/admin/auth/AdminAuthProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, roles, loading, configError, login } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && hasAnyAdminRole(roles)) router.replace("/admin");
  }, [loading, roles, router, user]);

  const handleLogin = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await login();
    } catch (nextError) {
      setError(adminErrorMessage(nextError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6 text-slate-100">
      <div className="absolute left-1/2 top-[-16rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      <section className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">KoofyLab Operations</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">관리자 로그인</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Firebase에 등록된 Google 관리자 계정과 서버에서 부여한 역할이 모두 확인되어야 접근할 수 있습니다.
        </p>
        <button
          onClick={() => void handleLogin()}
          disabled={submitting || loading || Boolean(configError)}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Chrome className="h-5 w-5" />
          {submitting ? "Google 로그인 중…" : "Google 계정으로 로그인"}
        </button>
        {configError || error ? (
          <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200">
            {configError || error}
          </p>
        ) : null}
        <div className="mt-8 flex items-start gap-3 border-t border-slate-800 pt-5 text-xs leading-5 text-slate-500">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
          로그인 주소를 아는 것만으로는 접근할 수 없습니다. 모든 조회와 변경은 App Check 및 역할 기반 서버 검사를 거칩니다.
        </div>
      </section>
    </main>
  );
}
