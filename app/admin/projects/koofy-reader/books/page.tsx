import { ReaderContentManager } from '../../../../../components/admin/reader/ReaderContentManager';
import { RoleGuard } from '../../../../../components/admin/shared/RoleGuard';
export default function Page() {
  return <RoleGuard role="superAdmin"><h1 className="sr-only">책 · 표지 관리</h1><ReaderContentManager kind="book" /></RoleGuard>;
}
