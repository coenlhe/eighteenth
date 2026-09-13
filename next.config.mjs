/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Prevents OneDrive path casing issues from crashing the dev server
    ignoreBuildErrors: true,
  },
};

export default nextConfig;