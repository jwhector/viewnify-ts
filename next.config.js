/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/**",
      }
    ]
  },
  webpack(config, { nextRuntime }) {
    if (typeof nextRuntime === "undefined") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config;
  }
}

module.exports = nextConfig
