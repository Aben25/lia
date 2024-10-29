const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ntckmekstkqxqgigqzgn.supabase.co'],
  },
  experimental: {
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
