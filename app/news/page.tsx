
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
  createdAt: string; // เพิ่ม createdAt เพื่อเรียงลำดับข่าว
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([]); // ใช้ Interface News ใน useState
  const router = useRouter();

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch("/api/news");
      const data: News[] = await res.json(); // กำหนดว่า data เป็น Array ของ News

      // เรียงข่าวตาม createdAt จากใหม่ไปเก่า
      const sortedNews = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNewsList(sortedNews); // กำหนดค่าข่าวที่เรียงแล้วให้กับ state
    }
    fetchNews();
  }, []);

  // ฟังก์ชันเพื่อแสดงวันที่ในรูปแบบที่เข้าใจง่าย
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("th-TH", options); // จะแสดงวันที่ในรูปแบบไทย
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">ข่าวสาร</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <div
            key={news._id}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
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
              <h2 className="text-xl font-bold mb-2 text-gray-900 truncate">{news.title}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.content}</p>

              {/* แสดงวันที่ที่อัปโหลด */}
              <p className="text-xs text-gray-500 mb-4">{formatDate(news.createdAt)}</p>

              <button
                onClick={() => router.push(`/news/${news._id}`)}
                className="text-blue-500 hover:text-blue-600 font-medium"
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
