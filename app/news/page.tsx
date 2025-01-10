
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// // กำหนด Type หรือ Interface สำหรับข้อมูลข่าวสาร
// interface News {
//   _id: string;
//   title: string;
//   content: string;
//   image: string;
// }

// export default function NewsPage() {
//   const [newsList, setNewsList] = useState<News[]>([]); // ใช้ Interface News ใน useState
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchNews() {
//       const res = await fetch("/api/news");
//       const data: News[] = await res.json(); // กำหนดว่า data เป็น Array ของ News
//       setNewsList(data);
//     }
//     fetchNews();
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center p-8"
//       style={{
//         backgroundImage: "url('/img/PC screen 1.png')",
//       }}
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {newsList.map((news) => (
//           <div
//             key={news._id}
//             className="bg-gray-900 bg-opacity-80 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
//           >
//             <div className="relative w-full h-48">
//               <Image
//                 src={news.image}
//                 alt={news.title}
//                 layout="fill"
//                 objectFit="cover"
//                 className="rounded-t-lg"
//                 priority
//               />
//             </div>
//             <div className="p-4 text-white">
//               <h2 className="text-2xl font-bold mb-2 truncate">{news.title}</h2>
//               <p className="text-gray-400 text-sm mb-4 line-clamp-3">
//                 {news.content}
//               </p>
//               <button
//                 onClick={() => router.push(`/news/${news._id}`)}
//                 className="text-blue-400 hover:underline text-sm"
//               >
//                 อ่านเพิ่มเติม
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// กำหนด Type หรือ Interface สำหรับข้อมูลข่าวสาร
interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]); // ใช้ Interface News ใน useState
  const router = useRouter();

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch("/api/news");
      const data: News[] = await res.json(); // กำหนดว่า data เป็น Array ของ News
      setNewsList(data);
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <div
            key={news._id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="relative w-full h-48">
              <Image
                src={news.image}
                alt={news.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                priority
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2 truncate">{news.title}</h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {news.content}
              </p>
              <button
                onClick={() => router.push(`/news/${news._id}`)}
                className="text-blue-400 hover:text-blue-500 font-medium"
              >
                อ่านเพิ่มเติม
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
