import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // TMDB artwork (posters, backdrops, profiles, provider logos)
      { protocol: "https", hostname: "image.tmdb.org" },
      // YouTube video thumbnails
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
