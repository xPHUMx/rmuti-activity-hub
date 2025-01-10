
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image"; // ใช้ Image จาก next/image

// interface NewsItem {
//   _id: string;
//   title: string;
//   content: string;
//   image: string;
// }

// export default function AdminNewsPage() {
//   const [news, setNews] = useState<NewsItem[]>([]);
//   const [file, setFile] = useState<File | null>(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   // ดึงข่าวสารทั้งหมด
//   const fetchNews = async () => {
//     const res = await fetch("/api/news");
//     const data: NewsItem[] = await res.json();
//     setNews(data);
//   };

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   // เพิ่มข่าวสาร
//   const handleAddNews = async () => {
//     if (!file || !title || !content) {
//       alert("กรุณากรอกข้อมูลให้ครบถ้วน");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("content", content);

//     const res = await fetch("/api/news", {
//       method: "POST",
//       body: formData,
//     });

//     if (res.ok) {
//       fetchNews();
//       setFile(null);
//       setTitle("");
//       setContent("");
//     } else {
//       alert("เกิดข้อผิดพลาดในการเพิ่มข่าวสาร");
//     }
//   };

//   // ลบข่าวสาร
//   const handleDeleteNews = async (id: string) => {
//     const res = await fetch("/api/news", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });

//     if (res.ok) {
//       fetchNews();
//     } else {
//       alert("เกิดข้อผิดพลาดในการลบข่าวสาร");
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: "url('/img/PC screen 2.png')" }}
//     >
//       <div className="container mx-auto py-8">
//         <h1 className="text-4xl font-bold mb-8 text-center">จัดการข่าวสาร</h1>

//         {/* ฟอร์มเพิ่มข่าวสาร */}
//         <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-12">
//           <h2 className="text-xl font-bold mb-4 text-center">เพิ่มข่าวสาร</h2>
//           <input
//             type="text"
//             placeholder="หัวข้อข่าวสาร"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <textarea
//             placeholder="เนื้อหาข่าวสาร"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <button
//             onClick={handleAddNews}
//             className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-500"
//           >
//             เพิ่มข่าวสาร
//           </button>
//         </div>

//         {/* แสดงข่าวสาร */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {news.map((item) => (
//             <div
//               key={item._id}
//               className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg"
//             >
//               <div className="relative w-full h-48">
//                 <Image
//                   src={item.image}
//                   alt={item.title}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-lg"
//                 />
//               </div>
//               <h3 className="text-xl font-bold mb-2">{item.title}</h3>
//               <p className="text-gray-400 text-sm mb-4 line-clamp-3">
//                 {item.content}
//               </p>
//               <button
//                 onClick={() => handleDeleteNews(item._id)}
//                 className="w-full bg-red-500 py-2 rounded text-white hover:bg-red-400"
//               >
//                 ลบ
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // ใช้ Image จาก next/image
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ดึงข่าวสารทั้งหมด
  const fetchNews = async () => {
    const res = await fetch("/api/news");
    const data: NewsItem[] = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // เพิ่มข่าวสาร
  const handleAddNews = async () => {
    if (!file || !title || !content) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("content", content);

    const res = await fetch("/api/news", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "เพิ่มข่าวสารสำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchNews();
      setFile(null);
      setTitle("");
      setContent("");
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเพิ่มข่าวสารได้",
      });
    }
  };

  // ลบข่าวสาร
  const handleDeleteNews = async (id: string) => {
    const confirmDelete = await Swal.fire({
      title: "คุณต้องการลบข่าวสารนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirmDelete.isConfirmed) return;

    const res = await fetch("/api/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "ลบข่าวสารสำเร็จ!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchNews();
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบข่าวสารได้",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/img/PC screen 2.png')" }}
    >
      <div className="container mx-auto py-8">
        {/* <h1 className="text-4xl font-bold mb-8 text-center">จัดการข่าวสาร</h1> */}

        {/* ฟอร์มเพิ่มข่าวสาร */}
        <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-12">
          <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
            <PlusCircleIcon className="h-6 w-6" /> เพิ่มข่าวสาร
          </h2>
          <input
            type="text"
            placeholder="หัวข้อข่าวสาร"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <textarea
            placeholder="เนื้อหาข่าวสาร"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleAddNews}
            className="w-full bg-orange-700 py-2 rounded text-white hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <PlusCircleIcon className="h-5 w-5" /> เพิ่มข่าวสาร
          </button>
        </div>

        {/* แสดงข่าวสาร */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg"
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {item.content}
              </p>
              <button
                onClick={() => handleDeleteNews(item._id)}
                className="w-full bg-red-500 py-2 rounded text-white hover:bg-red-400 flex items-center justify-center gap-2"
              >
                <TrashIcon className="h-5 w-5" /> ลบ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


