
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// interface News {
//   _id: string;
//   title: string;
//   content: string;
//   image: string;
//   createdAt: string;
//   pinned?: boolean;
// }

// export default function NewsPage() {
//   const [newsList, setNewsList] = useState<News[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6; // ✅ กำหนด 6 ข่าวต่อหน้า
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchNews() {
//       const res = await fetch("/api/news");
//       const data: News[] = await res.json();

//       const sortedNews = data.sort((a, b) => {
//         if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0)) {
//           return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
//         }
//         return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       });

//       setNewsList(sortedNews);
//     }
//     fetchNews();
//   }, []);

//   const formatDate = (date: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };
//     return new Date(date).toLocaleDateString("th-TH", options);
//   };

//   // ✅ คำนวณ pagination
//   const indexOfLastNews = currentPage * itemsPerPage;
//   const indexOfFirstNews = indexOfLastNews - itemsPerPage;
//   const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);
//   const totalPages = Math.ceil(newsList.length / itemsPerPage);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-4xl font-bold mb-8 text-center text-white">ข่าวสาร</h1>

//       {/* Grid ข่าว */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//   {currentNews.map((news, index) => (
//     <div
//       key={news._id}
//       className="bg-gray-100 text-black rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 transform hover:scale-105 hover:-translate-y-1 flex flex-col min-h-[4px] animate-fadeIn"
//       style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
//     >
//       <div className="relative w-full h-64 bg-gray-300">
//         <Image
//           src={news.image}
//           alt={news.title}
//           layout="fill"
//           objectFit="cover"
//           className="rounded-t-xl"
//           priority
//         />
//         {news.pinned && (
//           <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
//             📌 ปักหมุด
//           </div>
//         )}
//       </div>

//       <div className="p-4 flex flex-col flex-grow bg-white">
//         <h2 className="text-lg font-bold mb-2 truncate text-gray-900">{news.title}</h2>
//         <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{news.content}</p>
//         <p className="text-xs text-gray-500 mb-4">{formatDate(news.createdAt)}</p>

//         <button
//           onClick={() => router.push(`/news/${news._id}`)}
//           className="mt-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
//         >
//           อ่านเพิ่มเติม
//         </button>
//       </div>
//     </div>
//   ))}
// </div>


//       {/* ปุ่ม Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center mt-10 gap-4">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full disabled:opacity-50"
//           >
//             ย้อนกลับ
//           </button>

//           <span className="text-white">
//             หน้า {currentPage} / {totalPages}
//           </span>

//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full disabled:opacity-50"
//           >
//             หน้าถัดไป
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion"; // ✅ ใช้ motion

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  pinned?: boolean;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch("/api/news");
      const data: News[] = await res.json();

      const sortedNews = data.sort((a, b) => {
        if ((a.pinned ? 1 : 0) !== (b.pinned ? 1 : 0)) {
          return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setNewsList(sortedNews);
    }
    fetchNews();
  }, []);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("th-TH", options);
  };

  const indexOfLastNews = currentPage * itemsPerPage;
  const indexOfFirstNews = indexOfLastNews - itemsPerPage;
  const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white px-4 py-12 md:py-20 font-sarabun transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <div className="text-center mb-16 space-y-3 select-none">
          <h2 className="text-[10px] tracking-[0.3em] font-light text-orange-500 uppercase">
            News & Updates
          </h2>
          <h1 className="text-3xl font-extralight text-gray-800 dark:text-gray-200 tracking-wide">
            ข่าวสารและกิจกรรมประชาสัมพันธ์
          </h1>
        </div>

        {/* Grid ข่าว */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentNews.map((news, index) => (
            <motion.div
              key={news._id}
              className="group bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between h-[450px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
            >
              {/* รูปข้างบน */}
              <div className="relative w-full h-56 bg-gray-100 dark:bg-white/[0.01] overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                {news.pinned && (
                  <motion.div
                    className="absolute top-3 right-3 bg-orange-500 text-black text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-full shadow-[0_5px_15px_rgba(249,115,22,0.3)] z-10"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    📌 ปักหมุด
                  </motion.div>
                )}
              </div>

              {/* เนื้อหาข้างล่าง */}
              <div className="p-6 flex flex-col flex-grow bg-transparent justify-between">
                <div className="space-y-2">
                  <div className="text-[9px] tracking-widest text-gray-650 dark:text-gray-500 font-light uppercase">
                    {formatDate(news.createdAt)}
                  </div>
                  <h2 
                    onClick={() => router.push(`/news/${news._id}`)}
                    className="text-base font-light text-gray-800 dark:text-gray-200 tracking-wide hover:text-orange-500 transition-colors cursor-pointer line-clamp-1"
                  >
                    {news.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-light leading-relaxed line-clamp-3">
                    {news.content}
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/news/${news._id}`)}
                  className="w-full bg-gray-50 dark:bg-white/[0.02] hover:bg-orange-500 hover:text-black border border-gray-200 dark:border-white/[0.06] hover:border-orange-500 text-gray-700 dark:text-gray-300 text-xs font-light tracking-wider py-2.5 rounded-xl transition-all duration-500 mt-4"
                >
                  อ่านเพิ่มเติม
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ปุ่ม Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 gap-6 select-none">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.03] text-gray-700 dark:text-gray-300 disabled:opacity-20 disabled:pointer-events-none text-xs font-light tracking-wider px-5 py-2.5 rounded-xl transition-colors"
            >
              ย้อนกลับ
            </button>

            <span className="text-xs text-gray-600 dark:text-gray-500 font-light">
              หน้า {currentPage} จาก {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.03] text-gray-700 dark:text-gray-300 disabled:opacity-20 disabled:pointer-events-none text-xs font-light tracking-wider px-5 py-2.5 rounded-xl transition-colors"
            >
              หน้าถัดไป
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
