import type { NextConfig } from "next";

/*
 * A static site: `next build` writes it to out/, to be served beside dashboard.json and
 * map.json. NEXT_PUBLIC_BASE_PATH serves it from a sub-folder, such as /dashboard.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default config;
