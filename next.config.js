/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/download/easycc",
        destination: "http://38.45.67.130:1664/download/easycc",
      },
    ];
  },
};

module.exports = nextConfig;
