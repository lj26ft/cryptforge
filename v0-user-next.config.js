/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["picsum.photos"], // Add any other image domains you're using
  },
}

module.exports = nextConfig

