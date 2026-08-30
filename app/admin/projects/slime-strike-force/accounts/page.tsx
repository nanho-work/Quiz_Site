import { AccountSearch } from "../../../../../components/admin/slime/AccountSearch";
import { RoleGuard } from "../../../../../components/admin/shared/RoleGuard";
import { AdminPageHeader } from "../../../../../components/admin/shared/AdminPageHeader";

export default function SlimeAccountPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Customer Support"
        title="계정 조회"
        description="게임 설정에 표시되는 고객번호, Firebase UID 또는 정확한 Google 이메일로 사용자를 찾습니다."
      />
      <RoleGuard role="supportAdmin"><AccountSearch /></RoleGuard>
    </div>
  );
}
