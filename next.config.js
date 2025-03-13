/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'cdn.discordapp.com'],
  },
  basePath: '/IBRIPEDIA',
  assetPrefix: '/IBRIPEDIA/',
}

module.exports = nextConfig 