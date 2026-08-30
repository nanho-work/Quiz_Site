"use client";

import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  onIdTokenChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getAdminFirebaseServices } from "../../../lib/admin/firebase/client";
import type { AdminRoles } from "../../../lib/admin/types";

interface AdminAuthValue {
  user: User | null;
  roles: AdminRoles;
  loading: boolean;
  configError: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshClaims: () => Promise<void>;
}

const emptyRoles: AdminRoles = {
  superAdmin: false,
  supportAdmin: false,
  mailAdmin: false,
  financeAdmin: false,
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AdminRoles>(emptyRoles);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const applyClaims = useCallback(async (nextUser: User | null, force = false) => {
    setUser(nextUser);
    if (!nextUser) {
      setRoles(emptyRoles);
      return;
    }
    const token = await nextUser.getIdTokenResult(force);
    setRoles({
      superAdmin: token.claims.superAdmin === true,
      supportAdmin: token.claims.supportAdmin === true,
      mailAdmin: token.claims.mailAdmin === true,
      financeAdmin: token.claims.financeAdmin === true,
    });
  }, []);

  useEffect(() => {
    try {
      const { auth } = getAdminFirebaseServices();
      const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
        try {
          await applyClaims(nextUser);
          setConfigError(null);
        } catch (error) {
          setConfigError(error instanceof Error ? error.message : "관리자 인증 상태를 확인하지 못했습니다.");
        } finally {
          setLoading(false);
        }
      });
      return unsubscribe;
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : "Firebase 관리자 설정이 올바르지 않습니다.");
      setLoading(false);
      return undefined;
    }
  }, [applyClaims]);

  const value = useMemo<AdminAuthValue>(() => ({
    user,
    roles,
    loading,
    configError,
    login: async () => {
      const { auth } = getAdminFirebaseServices();
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    },
    logout: async () => {
      const { auth } = getAdminFirebaseServices();
      await signOut(auth);
    },
    refreshClaims: async () => {
      if (!user) return;
      await applyClaims(user, true);
    },
  }), [applyClaims, configError, loading, roles, user]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthValue {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("AdminAuthProvider가 필요합니다.");
  return context;
}

export function hasAnyAdminRole(roles: AdminRoles): boolean {
  return roles.superAdmin || roles.supportAdmin || roles.mailAdmin || roles.financeAdmin;
}

export function hasAdminRole(roles: AdminRoles, role?: keyof AdminRoles): boolean {
  return roles.superAdmin || role === undefined || roles[role];
}
