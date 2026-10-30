import type { NextConfig } from "next";
const nextConfig: NextConfig = { transpilePackages: ["@yella/types", "@yella/config"], images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] } };
export default nextConfig;
