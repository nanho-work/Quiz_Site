import { AuditLogTable } from "../../../../../components/admin/slime/AuditLogTable";
import { AdminPageHeader } from "../../../../../components/admin/shared/AdminPageHeader";
import { RoleGuard } from "../../../../../components/admin/shared/RoleGuard";

export default function SlimeAuditPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Security"
        title="감사 로그"
        description="개인정보 조회와 운영 메시지 등록처럼 영향을 주는 관리자 작업을 확인합니다."
      />
      <RoleGuard role="superAdmin"><AuditLogTable /></RoleGuard>
    </div>
  );
}
