"use client";

import Link from "next/link";

import { useLanguage } from "../LanguageProvider";

type PrivacyPolicyKey =
  | "website"
  | "bus-pop"
  | "honeybee"
  | "slime-strike-force";

const copy = {
  ko: {
    title: "서비스별 개인정보 처리방침",
    prompt: "확인할 서비스를 선택하세요",
    website: ["Koofy Lab 웹사이트", "웹사이트 이용 및 문의"],
    busPop: ["Bus Pop", "모바일 퍼즐 게임"],
    honeybee: ["허니비(Honeybee)", "모바일 머지 게임"],
    slimeStrikeForce: ["슬라임특공대", "모바일 디펜스 게임"],
  },
  en: {
    title: "Privacy policies by service",
    prompt: "Select a service to review",
    website: ["Koofy Lab Website", "Website use and inquiries"],
    busPop: ["Bus Pop", "Mobile puzzle game"],
    honeybee: ["Honeybee", "Mobile merge game"],
    slimeStrikeForce: ["Slime Strike Force", "Mobile defense game"],
  },
  ja: {
    title: "サービス別プライバシーポリシー",
    prompt: "確認するサービスを選択してください",
    website: ["Koofy Lab ウェブサイト", "ウェブサイトの利用とお問い合わせ"],
    busPop: ["Bus Pop", "モバイルパズルゲーム"],
    honeybee: ["Honeybee", "モバイルマージゲーム"],
    slimeStrikeForce: ["スライム特攻隊", "モバイル防衛ゲーム"],
  },
  zh: {
    title: "各服务隐私政策",
    prompt: "请选择要查看的服务",
    website: ["Koofy Lab 网站", "网站使用与咨询"],
    busPop: ["Bus Pop", "移动益智游戏"],
    honeybee: ["Honeybee", "移动合并游戏"],
    slimeStrikeForce: ["史莱姆特攻队", "手机塔防游戏"],
  },
} as const;

export default function PrivacyPolicyNav({
  active,
}: {
  active: PrivacyPolicyKey;
}) {
  const { language } = useLanguage();
  const labels = copy[language];
  const policies = [
    {
      key: "website" as const,
      href: "/privacy",
      label: labels.website[0],
      description: labels.website[1],
    },
    {
      key: "bus-pop" as const,
      href: "/bus-pop/privacy",
      label: labels.busPop[0],
      description: labels.busPop[1],
    },
    {
      key: "honeybee" as const,
      href: "/honeybee/privacy",
      label: labels.honeybee[0],
      description: labels.honeybee[1],
    },
    {
      key: "slime-strike-force" as const,
      href: "/slime-strike-force/privacy",
      label: labels.slimeStrikeForce[0],
      description: labels.slimeStrikeForce[1],
    },
  ];

  return (
    <nav className="mb-10" aria-label={labels.title}>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Privacy Center</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">
            {labels.title}
          </h2>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">
          {labels.prompt}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {policies.map((policy) => {
          const isActive = policy.key === active;

          return (
            <Link
              key={policy.key}
              href={policy.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "rounded-lg border px-4 py-3 transition",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted",
              ].join(" ")}
              role="listitem"
            >
              <span className="block font-bold">{policy.label}</span>
              <span
                className={[
                  "mt-0.5 block text-xs",
                  isActive
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {policy.description}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
