"use client";

import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { hasAnyAdminRole, useAdminAuth } from "./AdminAuthProvider";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, roles, loading, configError, refreshClaims } = useAdminAuth();

  useEffect(() => {
    if (!loading && !configError && !user) router.replace("/admin/login");
  }, [configError, loading, router, user]);

  if (loading) return <AdminStateMessage title="관리자 인증 확인 중" description="안전한 로그인 상태를 확인하고 있습니다." />;
  if (configError) return <AdminStateMessage title="관리자 웹 설정 필요" description={configError} error />;
  if (!user) return <AdminStateMessage title="로그인 화면으로 이동 중" description="잠시만 기다려 주세요." />;
  if (!hasAnyAdminRole(roles)) {
    return (
      <AdminStateMessage
        title="관리자 권한이 없습니다"
        description={`${user.email ?? user.uid} 계정에 서버 관리자 권한을 부여한 뒤 토큰을 갱신하세요.`}
        error
        actionLabel="권한 다시 확인"
        onAction={refreshClaims}
      />
    );
  }
  return children;
}

function AdminStateMessage({
  title,
  description,
  error = false,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  error?: boolean;
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
        <ShieldAlert className={`mx-auto mb-4 h-10 w-10 ${error ? "text-rose-400" : "text-emerald-400"}`} />
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
        {actionLabel && onAction ? (
          <button className="mt-6 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950" onClick={() => void onAction()}>
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
