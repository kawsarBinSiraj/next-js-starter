/**
 * robots.ts
 *
 * Generates the /robots.txt response for search engine crawlers.
 *
 * Crawling is controlled by the NEXT_PUBLIC_ALLOW_CRAWL env var:
 *   - "true"  → allow crawlers on public pages; block /dashboard and /api/
 *   - (unset) → block all crawlers (useful for staging / dev environments)
 *
 * Set NEXT_PUBLIC_APP_URL in .env to ensure the sitemap URL is correct
 * in production (e.g. https://yourdomain.com).
 */
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const allowCrawl = process.env.NEXT_PUBLIC_ALLOW_CRAWL === "true";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: allowCrawl ? "/" : undefined,
                disallow: allowCrawl ? ["/dashboard", "/api/"] : "/",
            },
        ],
        // Points crawlers to the sitemap for better indexing
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
