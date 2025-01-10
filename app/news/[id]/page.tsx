
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image"; // Import Image ของ Next.js

// export default function NewsDetailPage() {
//   const { id } = useParams(); // ดึง ID จาก URL
//   const [news, setNews] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchNewsDetail() {
//       try {
//         const res = await fetch(`/api/news/${id}`);
//         if (!res.ok) {
//           throw new Error("Failed to fetch news");
//         }
//         const data = await res.json();
//         setNews(data);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchNewsDetail();
//   }, [id]);

//   if (!news) {
//     return <div className="text-white">กำลังโหลด...</div>;
//   }

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center p-8"
//       style={{
//         backgroundImage: "url('/img/PC screen 1.png')",
//       }}
//     >
//       {/* ปุ่มย้อนกลับแบบมินิมอล */}
//       <button
//         onClick={() => router.push("/news")}
//         className="flex items-center text-white space-x-2 px-4 py-2 bg-gray-700 bg-opacity-50 hover:bg-opacity-70 rounded-lg mb-6"
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
//       <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 text-white">
//         <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
//         <div className="relative w-full h-64 mb-4">
//           <Image
//             src={news.image}
//             alt={news.title}
//             layout="fill" // ใช้ fill เพื่อให้ภาพครอบคลุมขนาด container
//             objectFit="cover" // ครอบภาพให้พอดี container
//             className="rounded"
//             priority // โหลดภาพนี้เป็นลำดับแรก
//           />
//         </div>
//         <p>{news.content}</p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// กำหนดประเภทของข่าวสาร
interface News {
  title: string;
  image: string;
  content: string;
}

export default function NewsDetailPage() {
  const { id } = useParams(); // ดึง ID จาก URL
  const [news, setNews] = useState<News | null>(null); // ระบุ Type ของ state
  const router = useRouter();

  useEffect(() => {
    async function fetchNewsDetail() {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        const data: News = await res.json(); // ระบุ Type ของ data ที่ได้รับ
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
      {/* ปุ่มย้อนกลับแบบมินิมอล */}
      <button
        onClick={() => router.push("/news")}
        className="flex items-center text-white space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg mb-6 transition"
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

      {/* รายละเอียดข่าว */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        <div className="w-full h-auto mb-6 overflow-hidden rounded-lg">
          <Image
            src={news.image}
            alt={news.title}
            width={1200} // ระบุขนาดให้ครอบคลุมหน้าจอ
            height={800} // อัตราส่วนสำหรับแสดงภาพเต็ม
            objectFit="contain" // ให้แสดงภาพแบบเต็มโดยไม่ครอบตัด
            className="rounded"
            priority
          />
        </div>
        <p className="text-gray-300 leading-relaxed">{news.content}</p>
      </div>
    </div>
  );
}
