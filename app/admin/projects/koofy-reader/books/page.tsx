import { ReaderContentManager } from '../../../../../components/admin/reader/ReaderContentManager';
import { RoleGuard } from '../../../../../components/admin/shared/RoleGuard';
import { AdminPageHeader } from '../../../../../components/admin/shared/AdminPageHeader';
export default function Page() { return <RoleGuard role="superAdmin"><div className="space-y-8"><AdminPageHeader eyebrow="Koofy Reader" title="책 · 표지 관리" description="책과 표지를 등록하고 앱 다운로드 목록에 공개합니다." /><ReaderContentManager kind="book" /></div></RoleGuard>; }
