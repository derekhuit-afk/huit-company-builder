import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/portal/", "/proposal/"],
      },
    ],
    sitemap: "https://huit.build/sitemap.xml",
    host: "https://huit.build",
  };
}
