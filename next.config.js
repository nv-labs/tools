/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "api.screenshotone.com",
    ],
  },
  env: {
    AIRTABLE_PAT: process.env.AIRTABLE_PAT,
  },
};

module.exports = nextConfig;
