import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://js.stripe.com https://eu-assets.i.posthog.com https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://api.stripe.com https://maps.googleapis.com https://maps.google.com https://eu.i.posthog.com https://eu-assets.i.posthog.com " + (process.env.NEXT_PUBLIC_API_URL || ''),
              "frame-src https://js.stripe.com https://maps.google.com",
              "worker-src blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};
export default nextConfig;
