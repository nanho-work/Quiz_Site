import { BookOpen, Type, BellRing, CreditCard, Gamepad2, History, LayoutDashboard, Map, Search } from "lucide-react";
import type { ComponentType } from "react";

export interface AdminNavigationItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  requiredRole?: "supportAdmin" | "mailAdmin" | "financeAdmin" | "superAdmin";
}

export interface AdminProject {
  id: string;
  name: string;
  shortName: string;
  description: string;
  status: "active" | "planned";
  href: string;
  accent: string;
  icon: ComponentType<{ className?: string }>;
  navigation: AdminNavigationItem[];
}

const slimeBase = "/admin/projects/slime-strike-force";

export const adminProjects: AdminProject[] = [
  {
    id: "slime-strike-force",
    name: "슬라임 특공대",
    shortName: "SSF",
    description: "계정, 서버 우편, 보상 및 운영 이력을 관리합니다.",
    status: "active",
    href: slimeBase,
    accent: "from-emerald-500 to-lime-400",
    icon: Gamepad2,
    navigation: [
      { label: "대시보드", href: slimeBase, icon: LayoutDashboard },
      { label: "계정 조회", href: `${slimeBase}/accounts`, icon: Search, requiredRole: "supportAdmin" },
      { label: "공지 · 우편", href: `${slimeBase}/mailbox`, icon: BellRing, requiredRole: "mailAdmin" },
      { label: "스테이지 운영", href: `${slimeBase}/stages`, icon: Map, requiredRole: "superAdmin" },
      { label: "결제 정보", href: `${slimeBase}/purchases`, icon: CreditCard, requiredRole: "financeAdmin" },
      { label: "감사 로그", href: `${slimeBase}/audit`, icon: History, requiredRole: "superAdmin" },
    ],
  },
  {
    id: "koofy-reader", name: "쿠피리더", shortName: "KOOFY",
    description: "책, 표지와 글꼴을 등록하고 앱 다운로드 목록을 관리합니다.",
    status: "active", href: "/admin/projects/koofy-reader", accent: "from-amber-500 to-orange-300", icon: BookOpen,
    navigation: [
      { label: "책 · 표지", href: "/admin/projects/koofy-reader/books", icon: BookOpen, requiredRole: "superAdmin" },
      { label: "글꼴", href: "/admin/projects/koofy-reader/fonts", icon: Type, requiredRole: "superAdmin" },
    ],
  },
];

export function findAdminProject(pathname: string): AdminProject | null {
  return adminProjects.find((project) => pathname.startsWith(project.href)) ?? null;
}
