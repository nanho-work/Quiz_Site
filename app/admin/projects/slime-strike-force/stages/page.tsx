import { StageContentManager } from "../../../../../components/admin/slime/stage-content/StageContentManager";
import { AdminPageHeader } from "../../../../../components/admin/shared/AdminPageHeader";
import { RoleGuard } from "../../../../../components/admin/shared/RoleGuard";

export default function SlimeStageContentPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Live Stage Content"
        title="스테이지 운영"
        description="경로, 전투 난이도와 보상을 폼으로 편집하고 서버 검증과 test 배포를 거쳐 production으로 승격합니다."
      />
      <RoleGuard role="superAdmin"><StageContentManager /></RoleGuard>
    </div>
  );
}
