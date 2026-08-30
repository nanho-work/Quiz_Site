import { CreditCard, ShieldAlert } from "lucide-react";
import { AdminCard } from "../../../../../components/admin/shared/AdminCard";
import { AdminNotice } from "../../../../../components/admin/shared/AdminNotice";
import { AdminPageHeader } from "../../../../../components/admin/shared/AdminPageHeader";
import { RoleGuard } from "../../../../../components/admin/shared/RoleGuard";

export default function SlimePurchasesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Billing"
        title="결제 정보"
        description="Google Play에서 검증된 구매 기록과 복구 작업을 위한 자리입니다."
      />
      <RoleGuard role="financeAdmin">
        <AdminNotice>
          현재 앱의 현금 상품은 출시 빌드에서 비활성화되어 있으며, 서버 구매 검증 원장도 연결하지 않았습니다.
        </AdminNotice>
        <AdminCard className="mt-5 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
            <CreditCard className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-white">결제 운영 기능 미연동</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            현금 상품을 활성화할 때 Google Play purchaseToken 검증, 주문번호 원장, 중복 지급 방지, 취소·환불 동기화를 서버에 먼저 추가합니다.
          </p>
          <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-left text-sm leading-6 text-amber-100">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            검증 원장 없이 운영자가 화면에서 재화를 직접 추가하는 기능은 만들지 않습니다.
          </div>
        </AdminCard>
      </RoleGuard>
    </div>
  );
}
