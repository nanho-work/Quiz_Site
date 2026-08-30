import { ArrowRight, Boxes } from "lucide-react";
import Link from "next/link";
import { AdminCard } from "../../components/admin/shared/AdminCard";
import { AdminPageHeader } from "../../components/admin/shared/AdminPageHeader";
import { adminProjects } from "../../lib/admin/projects";

export default function AdminProjectsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Project Console"
        title="운영 프로젝트 선택"
        description="프로젝트별 데이터와 권한은 분리하면서, 공통 운영 경험은 하나의 콘솔에서 유지합니다."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {adminProjects.map((project) => {
          const Icon = project.icon;
          return (
            <Link href={project.href} key={project.id}>
              <AdminCard className="group h-full overflow-hidden transition hover:-translate-y-1 hover:border-slate-700">
                <div className={`h-1.5 bg-gradient-to-r ${project.accent}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-emerald-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      운영 중
                    </span>
                  </div>
                  <h2 className="mt-6 text-lg font-bold text-white">{project.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{project.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                    프로젝트 열기 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </AdminCard>
            </Link>
          );
        })}
        <AdminCard className="flex min-h-64 items-center justify-center border-dashed p-6 text-center">
          <div>
            <Boxes className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-4 font-semibold text-slate-400">다음 프로젝트</p>
            <p className="mt-2 text-sm text-slate-600">프로젝트 등록 정보와 하위 모듈만 추가하면 됩니다.</p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
