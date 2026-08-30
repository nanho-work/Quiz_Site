import { MailboxManager } from "../../../../../components/admin/slime/MailboxManager";
import { AdminPageHeader } from "../../../../../components/admin/shared/AdminPageHeader";
import { RoleGuard } from "../../../../../components/admin/shared/RoleGuard";

export default function SlimeMailboxPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Live Operations"
        title="공지 · 우편"
        description="전체 캠페인과 개별 사용자 우편을 분리해 관리합니다. 보상은 게임 서버에서 1회만 지급됩니다."
      />
      <RoleGuard role="mailAdmin"><MailboxManager /></RoleGuard>
    </div>
  );
}
