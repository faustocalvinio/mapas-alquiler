import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public", // Carpeta donde se guardará el service worker
  register: true,
  skipWaiting: true,
});


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      }],
  },
};

export default withPWA(nextConfig);
