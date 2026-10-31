import GeneralBookManager from '../../../../../components/admin/reader/GeneralBookManager';
import { RoleGuard } from '../../../../../components/admin/shared/RoleGuard';
export default function Page() { return <RoleGuard role="superAdmin"><GeneralBookManager /></RoleGuard>; }
