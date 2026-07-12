/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep dev (`.next`) separate from local verify builds (`.next-build`) so
  // `yarn verify` can run while `yarn dev` is up without corrupting HMR output.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  transpilePackages: ["@react-pdf/renderer"],
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
};

export default nextConfig;
