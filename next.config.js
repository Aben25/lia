const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ntckmekstkqxqgigqzgn.supabase.co'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'https://effective-space-acorn-jgqjqqgpgj3pxpq-3000.app.github.dev',
      ],
    },
    swcPlugins: [
      [
        '@onlook/nextjs',
        {
          root: path.resolve('.'),
        },
      ],
    ],
  },
};
module.exports = nextConfig;
