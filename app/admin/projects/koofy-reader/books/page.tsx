import WorkTranslations from '../../../../../components/admin/reader/WorkTranslations';
import { RoleGuard } from '../../../../../components/admin/shared/RoleGuard';
export default function Page() {
  return <RoleGuard role="superAdmin"><WorkTranslations kind="book" /></RoleGuard>;
}
