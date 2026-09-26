import type { MetadataRoute } from "next";

import { productSlugs } from "../lib/marketing";

const SITE_URL = "https://www.koofy.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/koofy-reader/privacy", changeFrequency: "yearly", priority: 0.5 },
    { path: "/koofy-reader/support", changeFrequency: "yearly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
    { path: "/bus-pop/privacy", changeFrequency: "yearly", priority: 0.5 },
    { path: "/honeybee/privacy", changeFrequency: "yearly", priority: 0.5 },
    {
      path: "/slime-strike-force/privacy",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      path: "/slime-strike-force/terms",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  routes.push(
    ...[
      "/products",
      "/koofy-reader",
      "/support",
      "/policies",
      ...productSlugs.map((slug) => `/products/${slug}`),
    ].map((path) => ({
      path,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );
  return routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
