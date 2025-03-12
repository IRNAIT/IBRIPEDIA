/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['avatars.githubusercontent.com', 'cdn.discordapp.com'],
    unoptimized: true,
  },
  basePath: '/IBRIPEDIA',
}

module.exports = nextConfig 