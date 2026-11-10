import type { NextConfig } from "next";
// res.cloudinary.com
const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        hostname: "www.volgahimplast.ru",
      },
      {
        hostname: 'hegen.ae'
      },
      {
        hostname: "kentuckybelleboutique.com"
      },
      {
        hostname: "cdn.shopify.com"
      },
      {
        hostname: "image.cnbcfm.com"
      },
      {
        hostname: "images.squarespace-cdn.com"
      },
      {
        hostname: "res.cloudinary.com"
      },
      {
        hostname: "encrypted-tbn0.gstatic.com"
      },
      {
        hostname: "upload.wikimedia.org"
      },
    ]
   }
};

export default nextConfig;
