/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PUSH_PUBLIC_KEY: process.env.PUSH_PUBLIC_KEY,
  },
};

module.exports = nextConfig;
