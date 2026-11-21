import InterviewWorkspace from '../../../../../components/admin/reader/InterviewWorkspace';
import { RoleGuard } from '../../../../../components/admin/shared/RoleGuard';

export default function Page() {
  return <RoleGuard role="superAdmin"><InterviewWorkspace /></RoleGuard>;
}
