import MonthlyWorkspace from '../../../../../components/admin/reader/MonthlyWorkspace';
import { RoleGuard } from '../../../../../components/admin/shared/RoleGuard';
export default function Page() {
  return <RoleGuard role="superAdmin"><h1 className="sr-only">월간 쿠피 관리</h1><MonthlyWorkspace /></RoleGuard>;
}
