
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* ปุ่มด้านบน */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/news")}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
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
          className="px-6 py-2 bg-green-600 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-300"
        >
          ลงทะเบียนกิจกรรม
        </button>
      </div>

      {/* กล่องข่าวสาร */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white text-black rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{news.title}</h1>

        <div className="w-full h-auto mb-6 overflow-hidden rounded-lg">
          <Image
            src={news.image}
            alt={news.title}
            width={1200}
            height={800}
            objectFit="cover"
            className="rounded"
            priority
          />
        </div>

        <p className="text-gray-700 leading-relaxed">{news.content}</p>
      </motion.div>
    </div>
  );
}
