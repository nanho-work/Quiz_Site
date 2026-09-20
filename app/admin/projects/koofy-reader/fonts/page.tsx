import { ReaderContentManager } from '../../../../../components/admin/reader/ReaderContentManager';
import { RoleGuard } from '../../../../../components/admin/shared/RoleGuard';
import { AdminPageHeader } from '../../../../../components/admin/shared/AdminPageHeader';
export default function Page() { return <RoleGuard role="superAdmin"><div className="space-y-8"><AdminPageHeader eyebrow="Koofy Reader" title="글꼴 관리" description="글꼴을 굵기별로 등록하고 앱에서 내려받을 수 있도록 공개합니다." /><ReaderContentManager kind="font" /></div></RoleGuard>; }
