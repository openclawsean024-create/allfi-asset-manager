import type { NextConfig } from "next";

// Note: For Vercel deployment, remove output: "export"
// GitHub Pages static hosting is a fallback (see .github/workflows/deploy.yml)
// but requires a different auth approach since static export disables API routes.
const nextConfig: NextConfig = {
  // output: "export", // Disabled: breaks NextAuth API routes; Vercel handles SSR instead
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
