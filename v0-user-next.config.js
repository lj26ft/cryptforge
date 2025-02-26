/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com", "picsum.photos"], // Add any other domains you're loading images from
  },
  // Add any other Next.js config options here
}

module.exports = nextConfig

