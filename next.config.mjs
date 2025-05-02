/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'randomuser.me'],
    unoptimized: true,
  },
  // Adicionar configurações de cookies
  serverRuntimeConfig: {
    cookieDomain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
  },
  // Adicionar configurações de headers para cookies
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Set-Cookie',
            value: 'SameSite=Lax; Secure; Path=/; HttpOnly',
          },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
