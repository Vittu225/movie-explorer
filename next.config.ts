import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kinopoiskapiunofficial.tech',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '://mzstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kinopoisk.ru', // На всякий случай добавим и этот
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
