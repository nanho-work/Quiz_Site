import { BellRing, CreditCard, Map, Search, ServerCog } from "lucide-react";
import Link from "next/link";
import { AdminCard } from "../../../../components/admin/shared/AdminCard";
import { AdminNotice } from "../../../../components/admin/shared/AdminNotice";
import { AdminPageHeader } from "../../../../components/admin/shared/AdminPageHeader";

const base = "/admin/projects/slime-strike-force";
const modules = [
  { href: `${base}/accounts`, title: "계정 조회", description: "고객번호, UID 또는 이메일로 계정과 진행 상태를 확인합니다.", icon: Search },
  { href: `${base}/mailbox`, title: "공지 · 우편", description: "전체 공지와 보상 우편, 개별 고객 우편을 발송합니다.", icon: BellRing },
  { href: `${base}/stages`, title: "스테이지 운영", description: "스테이지 경로, 난이도와 보상을 검증 후 단계적으로 배포합니다.", icon: Map },
  { href: `${base}/purchases`, title: "결제 정보", description: "검증된 Google Play 구매 원장 연결 상태를 확인합니다.", icon: CreditCard },
];

export default function SlimeStrikeForceAdminPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Slime Strike Force"
        title="슬라임 특공대 운영"
        description="게임 클라이언트가 아닌 권한 검증된 서버 API를 통해 계정과 보상을 관리합니다."
      />
      <AdminNotice>
        현재 현금 상품은 비활성화되어 있습니다. 결제 메뉴는 Play 구매 검증 원장이 추가되기 전까지 조회·복구 작업을 실행하지 않습니다.
      </AdminNotice>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link href={module.href} key={module.href}>
              <AdminCard className="h-full p-6 transition hover:-translate-y-1 hover:border-slate-700">
                <Icon className="h-7 w-7 text-emerald-400" />
                <h2 className="mt-5 font-bold text-white">{module.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{module.description}</p>
              </AdminCard>
            </Link>
          );
        })}
      </div>
      <AdminCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-slate-800 p-3 text-slate-300"><ServerCog className="h-6 w-6" /></div>
          <div>
            <h2 className="font-bold text-white">운영 경계</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              화면에서 입력한 금액은 메일 보상 계약 범위 안에서만 전달되며, 실제 지급은 서버가 계정 상태와 중복 수령 여부를 검증한 뒤 처리합니다.
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
