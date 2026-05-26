import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/env";

const baseUrl = getAppUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/login",
    "/signup",
    "/dashboard",
    "/notes",
    "/focus",
    "/tasks",
    "/habits",
    "/utilities",
    "/analytics",
    "/settings",
  ];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/dashboard" ? 0.9 : 0.7,
  }));
}
