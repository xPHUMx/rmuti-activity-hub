/** @type {import('next').NextConfig} */

// const nextConfig = {
//   reactStrictMode: true, // เปิดใช้งาน React Strict Mode
//   images: {
//     // กำหนดโดเมนที่อนุญาตสำหรับการใช้ next/image
//     domains: [
//       "lh3.googleusercontent.com",
//       "www.eng.rmuti.ac.th",
//       "rmuti-activity.s3.ap-southeast-1.amazonaws.com",
//     ],
//   },
//   webpack: (config) => {
//     // เพิ่มการตั้งค่า Webpack หากจำเป็น
//     config.resolve.fallback = { fs: false };
//     return config;
//   },
// };

// module.exports = nextConfig;

const nextConfig = {
  reactStrictMode: true, // เปิดใช้งาน React Strict Mode
  images: {
    // กำหนด remotePatterns สำหรับการใช้ next/image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.eng.rmuti.ac.th",
      },
      {
        protocol: "https",
        hostname: "rmuti-activity.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
  webpack: (config) => {
    // เพิ่มการตั้งค่า Webpack หากจำเป็น
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;
