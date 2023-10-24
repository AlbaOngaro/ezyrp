/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@nimblerp/surreal-trigger", "@nimblerp/railway-trigger"],
  reactStrictMode: true,
  env: {
    PUSH_PUBLIC_KEY: process.env.PUSH_PUBLIC_KEY,
  },
};

module.exports = nextConfig;
