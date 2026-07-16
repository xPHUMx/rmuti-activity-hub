
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";

// // กำหนดประเภทของข่าวสาร
// interface News {
//   title: string;
//   image: string;
//   content: string;
// }

// export default function NewsDetailPage() {
//   const { id } = useParams(); // ดึง ID จาก URL
//   const [news, setNews] = useState<News | null>(null); // ระบุ Type ของ state
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchNewsDetail() {
//       try {
//         const res = await fetch(`/api/news/${id}`);
//         if (!res.ok) {
//           throw new Error("Failed to fetch news");
//         }
//         const data: News = await res.json(); // ระบุ Type ของ data ที่ได้รับ
//         setNews(data);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchNewsDetail();
//   }, [id]);

//   if (!news) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-white text-black">
//         กำลังโหลด...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white text-black p-8">
//       {/* ปุ่มย้อนกลับแบบมินิมอล */}
//       <button
//         onClick={() => router.push("/news")}
//         className="flex items-center text-black space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg mb-6 transition"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={2}
//           stroke="currentColor"
//           className="w-5 h-5"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M15.75 19.5L8.25 12l7.5-7.5"
//           />
//         </svg>
//         <span>ย้อนกลับ</span>
//       </button>

//       {/* รายละเอียดข่าว */}
//       <div className="bg-white rounded-lg p-6 shadow-lg">
//         <h1 className="text-3xl font-bold mb-4 text-gray-900">{news.title}</h1>
//         <div className="w-full h-auto mb-6 overflow-hidden rounded-lg">
//           <Image
//             src={news.image}
//             alt={news.title}
//             width={1200} // ระบุขนาดให้ครอบคลุมหน้าจอ
//             height={800} // อัตราส่วนสำหรับแสดงภาพเต็ม
//             objectFit="contain" // ให้แสดงภาพแบบเต็มโดยไม่ครอบตัด
//             className="rounded"
//             priority
//           />
//         </div>
//         <p className="text-gray-700 leading-relaxed">{news.content}</p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

interface News {
  title: string;
  image: string;
  content: string;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState<News | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchNewsDetail() {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data: News = await res.json();
        setNews(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNewsDetail();
  }, [id]);

  if (!news) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white transition-colors duration-300">
        <div className="luxury-loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white px-4 py-12 md:py-20 font-sarabun transition-colors duration-300">
      <div className="container mx-auto max-w-4xl">
        {/* Top Bar Action Buttons */}
        <div className="flex justify-between items-center mb-10 select-none">
          <button
            onClick={() => router.push("/news")}
            className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.03] text-gray-700 dark:text-gray-300 rounded-xl transition duration-300 text-xs font-light tracking-wider"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <span>ย้อนกลับ</span>
          </button>

          {/* ✅ ปุ่มลงทะเบียนกิจกรรม */}
          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black text-xs font-medium tracking-wider rounded-xl shadow-[0_5px_15px_rgba(249,115,22,0.15)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition duration-300"
          >
            ลงทะเบียนกิจกรรม
          </button>
        </div>

        {/* กล่องข่าวสาร */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] backdrop-blur-xl p-8 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.6)] text-gray-900 dark:text-white transition-all duration-300"
        >
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-light text-gray-800 dark:text-gray-100 tracking-wide leading-tight mb-8">
            {news.title}
          </h1>

          {/* Image */}
          <div className="w-full relative h-[450px] mb-8 overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/[0.01]">
            <Image
              src={news.image}
              alt={news.title}
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
              priority
            />
          </div>

          {/* Content text */}
          <div className="text-gray-700 dark:text-gray-300 font-light leading-relaxed text-sm md:text-base whitespace-pre-line space-y-4 select-text">
            {news.content}
          </div>
        </motion.article>
      </div>
    </div>
  );
}
