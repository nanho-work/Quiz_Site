import type { MetadataRoute } from "next";

const SITE_URL = "https://www.koofy.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/calculators", changeFrequency: "weekly", priority: 0.9 },
    { path: "/salary-calculator", changeFrequency: "weekly", priority: 0.9 },
    { path: "/minimum-wage-calculator", changeFrequency: "weekly", priority: 0.9 },
    { path: "/income-tax-calculator", changeFrequency: "weekly", priority: 0.9 },
    { path: "/tax-refund-calculator", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
    { path: "/legal/consultation-consent", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
