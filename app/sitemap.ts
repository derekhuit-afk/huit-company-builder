import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://huit.build";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/build`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
