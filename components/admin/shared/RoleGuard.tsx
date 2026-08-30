"use client";

import type { AdminRoles } from "../../../lib/admin/types";
import { hasAdminRole, useAdminAuth } from "../auth/AdminAuthProvider";
import { AdminNotice } from "./AdminNotice";

export function RoleGuard({
  role,
  children,
}: {
  role: keyof AdminRoles;
  children: React.ReactNode;
}) {
  const { roles } = useAdminAuth();
  if (!hasAdminRole(roles, role)) {
    return <AdminNotice tone="error">이 화면을 사용할 수 있는 <strong>{role}</strong> 권한이 없습니다.</AdminNotice>;
  }
  return children;
}
