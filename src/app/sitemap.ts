/**
 * sitemap.ts
 *
 * Generates the /sitemap.xml response for search engines.
 *
 * Only public-facing pages are listed here — protected routes
 * like /dashboard are intentionally excluded.
 *
 * Set NEXT_PUBLIC_APP_URL in .env to ensure URLs are correct
 * in production (e.g. https://yourdomain.com).
 */
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: baseUrl,           // Home page
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1,
        },
    ];
}
