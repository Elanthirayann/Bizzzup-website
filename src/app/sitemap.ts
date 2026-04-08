import type { MetadataRoute } from "next";

const SITE_URL = "https://bizzzup.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date("2026-03-20"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
