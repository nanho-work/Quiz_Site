"use client";

import { ChevronDown, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { adminProjects, findAdminProject } from "../../../lib/admin/projects";
import { hasAdminRole, useAdminAuth } from "../auth/AdminAuthProvider";
import { RequireAdmin } from "../auth/RequireAdmin";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, roles, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const project = findAdminProject(pathname);

  if (pathname === "/admin/login") return children;

  const visibleNavigation = project?.navigation.filter((item) =>
    hasAdminRole(roles, item.requiredRole),
  ) ?? [];

  return (
    <RequireAdmin>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur lg:pl-72">
          <button
            className="mr-3 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="관리 메뉴 열기"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-400" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">KoofyLab Admin</p>
              <p className="truncate text-xs text-slate-500">{project?.name ?? "프로젝트 선택"}</p>
            </div>
          </div>
          <select
            aria-label="관리 프로젝트 선택"
            value={project?.id ?? ""}
            onChange={(event) => {
              const selected = adminProjects.find((item) => item.id === event.target.value);
              router.push(selected?.href ?? "/admin");
            }}
            className="mr-3 hidden rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none sm:block"
          >
            <option value="">프로젝트 선택</option>
            {adminProjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <div className="hidden text-right md:block">
            <p className="max-w-48 truncate text-xs font-semibold text-slate-200">{user?.displayName || user?.email}</p>
            <p className="max-w-48 truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={() => void logout()}
            className="ml-3 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="로그아웃"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800 bg-slate-950 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
            <Link href="/admin" className="font-bold tracking-tight text-white" onClick={() => setMobileOpen(false)}>
              KOOFYLAB <span className="text-emerald-400">OPS</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-400 lg:hidden" aria-label="관리 메뉴 닫기">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="mb-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-slate-700"
            >
              모든 프로젝트
              <ChevronDown className="h-4 w-4" />
            </Link>
            {project ? (
              <nav className="space-y-1">
                <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-600">{project.shortName}</p>
                {visibleNavigation.map((item) => {
                  const active = item.href === pathname;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-emerald-500/15 text-emerald-300" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <p className="px-3 text-sm leading-6 text-slate-500">관리할 프로젝트를 선택하면 기능별 메뉴가 나타납니다.</p>
            )}
          </div>
        </aside>

        {mobileOpen ? <button className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="관리 메뉴 닫기" /> : null}

        <main className="min-h-screen px-4 pb-12 pt-24 sm:px-6 lg:ml-72 lg:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </RequireAdmin>
  );
}
