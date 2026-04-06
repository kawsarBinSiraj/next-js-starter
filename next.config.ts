import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Produce a self-contained build in .next/standalone so the Docker
    // image only ships the files needed to run the app (no node_modules).
    output: "standalone",
};

export default nextConfig;
