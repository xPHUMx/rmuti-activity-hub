
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image"; // ใช้ Image จาก next/image
// import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
// import Swal from "sweetalert2";

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
//       Swal.fire({
//         icon: "warning",
//         title: "ข้อมูลไม่ครบ",
//         text: "กรุณากรอกข้อมูลให้ครบถ้วน",
//       });
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
//       Swal.fire({
//         icon: "success",
//         title: "เพิ่มข่าวสารสำเร็จ!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       fetchNews();
//       setFile(null);
//       setTitle("");
//       setContent("");
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด",
//         text: "ไม่สามารถเพิ่มข่าวสารได้",
//       });
//     }
//   };

//   // ลบข่าวสาร
//   const handleDeleteNews = async (id: string) => {
//     const confirmDelete = await Swal.fire({
//       title: "คุณต้องการลบข่าวสารนี้ใช่หรือไม่?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "ลบ",
//       cancelButtonText: "ยกเลิก",
//     });

//     if (!confirmDelete.isConfirmed) return;

//     const res = await fetch("/api/news", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id }),
//     });

//     if (res.ok) {
//       Swal.fire({
//         icon: "success",
//         title: "ลบข่าวสารสำเร็จ!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       fetchNews();
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด",
//         text: "ไม่สามารถลบข่าวสารได้",
//       });
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: "url('/img/PC screen 1.png')" }}
//     >
//       <div className="container mx-auto py-8">
//         {/* <h1 className="text-4xl font-bold mb-8 text-center">จัดการข่าวสาร</h1> */}

//         {/* ฟอร์มเพิ่มข่าวสาร */}
//         <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-12">
//           <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
//             <PlusCircleIcon className="h-6 w-6" /> เพิ่มข่าวสาร
//           </h2>
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
//             className="w-full bg-green-600 py-2 rounded text-white hover:bg-blue-600 flex items-center justify-center gap-2"
//           >
//             <PlusCircleIcon className="h-5 w-5" /> เพิ่มข่าวสาร
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
//                 className="w-full bg-red-500 py-2 rounded text-white hover:bg-red-400 flex items-center justify-center gap-2"
//               >
//                 <TrashIcon className="h-5 w-5" /> ลบ
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image"; 
// import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
// import Swal from "sweetalert2";

// interface NewsItem {
//   _id: string;
//   title: string;
//   content: string;
//   image: string;
//   pinned: boolean; // ✅ เพิ่ม pinned เข้า NewsItem
//   createdAt: string; // ✅ เพิ่ม createdAt ด้วย จะได้เรียงได้
// }

// export default function AdminNewsPage() {
//   const [news, setNews] = useState<NewsItem[]>([]);
//   const [file, setFile] = useState<File | null>(null);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [pinned, setPinned] = useState(false);

//   // ดึงข่าวสารทั้งหมด
//   const fetchNews = async () => {
//     const res = await fetch("/api/news");
//     const data: NewsItem[] = await res.json();

//     // ✅ เรียงข่าว: ปักหมุดก่อน แล้วเรียงใหม่สุดอยู่ซ้าย
//     const sorted = data.sort((a, b) => {
//       if (a.pinned === b.pinned) {
//         return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//       }
//       return b.pinned ? 1 : -1;
//     });

//     setNews(sorted);
//   };

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   const handleAddNews = async () => {
//     if (!file || !title || !content) {
//       Swal.fire({
//         icon: "warning",
//         title: "ข้อมูลไม่ครบ",
//         text: "กรุณากรอกข้อมูลให้ครบถ้วน",
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
//     formData.append("content", content);
//     formData.append("pinned", JSON.stringify(pinned)); 

//     const res = await fetch("/api/news", {
//       method: "POST",
//       body: formData,
//     });

//     if (res.ok) {
//       Swal.fire({
//         icon: "success",
//         title: "เพิ่มข่าวสารสำเร็จ!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       fetchNews();
//       setFile(null);
//       setTitle("");
//       setContent("");
//       setPinned(false);
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด",
//         text: "ไม่สามารถเพิ่มข่าวสารได้",
//       });
//     }
//   };

//   const handleDeleteNews = async (item: NewsItem) => {
//     // item = ข้อมูลข่าวที่ส่งมา เช่น title, content, pinned
  
//     const confirmDelete = await Swal.fire({
//       title: item.pinned
//         ? "ข่าวนี้ถูกปักหมุดอยู่ ต้องการลบจริงหรือไม่?"
//         : "คุณต้องการลบข่าวสารนี้ใช่หรือไม่?",
//       text: item.pinned ? "หากลบจะหายทั้งข่าวและปักหมุด" : undefined,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "ลบ",
//       cancelButtonText: "ยกเลิก",
//     });
  
//     if (!confirmDelete.isConfirmed) return;
  
//     const res = await fetch("/api/news", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: item._id }),
//     });
  
//     if (res.ok) {
//       Swal.fire({
//         icon: "success",
//         title: "ลบข่าวสารสำเร็จ!",
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       fetchNews();
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด",
//         text: "ไม่สามารถลบข่าวสารได้",
//       });
//     }
//   };
  
//   const handleTogglePinned = async (id: string) => {
//     try {
//       const res = await fetch("/api/news/pin", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
  
//       const data = await res.json();
  
//       if (res.ok) {
//         Swal.fire({
//           icon: "success",
//           title: data.pinned ? "ปักหมุดข่าวสารสำเร็จ!" : "ถอนหมุดข่าวสารสำเร็จ!",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         fetchNews(); // ✅ โหลดใหม่หลังปักหมุด
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "เกิดข้อผิดพลาด",
//           text: data.error || "ไม่สามารถเปลี่ยนสถานะปักหมุดได้",
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด",
//         text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
//       });
//     }
//   };
  
//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: "url('/img/PC screen 1.png')" }}
//     >
//       <div className="container mx-auto py-8">

//         {/* ฟอร์มเพิ่มข่าวสาร */}
//         <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-12">
//           <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
//             <PlusCircleIcon className="h-6 w-6" /> เพิ่มข่าวสาร
//           </h2>

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

//           {/* Checkbox ปักหมุด */}
//           <label className="flex items-center mb-3">
//             <input
//               type="checkbox"
//               checked={pinned}
//               onChange={(e) => setPinned(e.target.checked)}
//               className="mr-2"
//             />
//             ปักหมุดข่าวสาร
//           </label>

//           <button
//             onClick={handleAddNews}
//             className="w-full bg-green-600 py-2 rounded text-white hover:bg-blue-600 flex items-center justify-center gap-2"
//           >
//             <PlusCircleIcon className="h-5 w-5" /> เพิ่มข่าวสาร
//           </button>
//         </div>

//         {/* แสดงข่าวสาร */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {news.map((item) => (
//             <div
//               key={item._id}
//               className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg relative"
//             >
//               {/* รูปภาพข่าว */}
//               <div className="relative w-full h-48">
//                 <Image
//                   src={item.image}
//                   alt={item.title}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-lg"
//                 />
//                 {item.pinned && (
//                   <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
//                     📌 ปักหมุด
//                   </div>
//                 )}
//               </div>

//               {/* เนื้อหาข่าว */}
//               <h3 className="text-xl font-bold mb-2">{item.title}</h3>

//               <p className="text-gray-400 text-sm mb-4 line-clamp-3">
//                 {item.content}
//               </p>

//               {/* ปุ่มลบ */}
//               <button
//                  onClick={() => handleDeleteNews(item)}
//                  className="w-full bg-red-500 py-2 rounded text-white hover:bg-red-400 flex items-center justify-center gap-2">
//                   <TrashIcon className="h-5 w-5" /> ลบ
//               </button>

//               {/* ปุ่มปักหมุด/ถอนหมุด */}
//               <button
//                 onClick={() => handleTogglePinned(item._id)}
//                 className="w-full bg-yellow-500 py-2 rounded text-white hover:bg-yellow-400 mt-2 flex items-center justify-center gap-2"
//               >
//                 {item.pinned ? "ถอนหมุด" : "ปักหมุด"}
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
import Image from "next/image";
import { PlusCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
  pinned: boolean;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchNews = async () => {
    const res = await fetch("/api/news");
    const data: NewsItem[] = await res.json();
    const sorted = data.sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.pinned ? 1 : -1;
    });
    setNews(sorted);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setContent("");
    setPinned(false);
    setEditingId(null);
  };

  const handleAddOrEditNews = async () => {
    if (!title || !content) {
      Swal.fire({ icon: "warning", title: "ข้อมูลไม่ครบ", text: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      return;
    }

    if (editingId) {
      // โหมดแก้ไข
      const res = await fetch("/api/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, title, content }),
      });

      if (res.ok) {
        Swal.fire({ icon: "success", title: "แก้ไขข่าวสำเร็จ!", timer: 1500, showConfirmButton: false });
        fetchNews();
        resetForm();
      } else {
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถแก้ไขข่าวได้" });
      }
    } else {
      // โหมดเพิ่ม
      if (!file) {
        Swal.fire({ icon: "warning", title: "กรุณาเลือกรูปภาพ" });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("pinned", JSON.stringify(pinned));

      const res = await fetch("/api/news", { method: "POST", body: formData });

      if (res.ok) {
        Swal.fire({ icon: "success", title: "เพิ่มข่าวสารสำเร็จ!", timer: 1500, showConfirmButton: false });
        fetchNews();
        resetForm();
      } else {
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถเพิ่มข่าวได้" });
      }
    }
  };

  const handleDeleteNews = async (item: NewsItem) => {
    const confirm = await Swal.fire({
      title: item.pinned ? "ข่าวนี้ถูกปักหมุดอยู่ ต้องการลบจริงหรือไม่?" : "คุณต้องการลบข่าวสารนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch("/api/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item._id }),
    });

    if (res.ok) {
      Swal.fire({ icon: "success", title: "ลบข่าวสารสำเร็จ!", timer: 1500, showConfirmButton: false });
      fetchNews();
    } else {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถลบข่าวสารได้" });
    }
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingId(item._id);
    setTitle(item.title);
    setContent(item.content);
    setPinned(item.pinned);
    setFile(null); // ไม่แก้ไขรูปภาพ
  };

  const handleTogglePinned = async (id: string) => {
    try {
      const res = await fetch("/api/news/pin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: "success", title: data.pinned ? "ปักหมุดสำเร็จ" : "ถอนหมุดสำเร็จ", timer: 1500, showConfirmButton: false });
        fetchNews();
      } else {
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: data.error });
      }
    } catch {
      Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถเชื่อมต่อได้" });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('/img/PC screen 1.png')" }}>
      <div className="container mx-auto py-8">
        {/* ฟอร์ม */}
        <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-12">
          <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
            <PlusCircleIcon className="h-6 w-6" /> {editingId ? "แก้ไขข่าวสาร" : "เพิ่มข่าวสาร"}
          </h2>

          <input type="text" placeholder="หัวข้อข่าวสาร" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-3 p-2 rounded bg-gray-700 text-white" />

          <textarea placeholder="เนื้อหาข่าวสาร" value={content} onChange={(e) => setContent(e.target.value)} className="w-full mb-3 p-2 rounded bg-gray-700 text-white" />

          {!editingId && (
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full mb-3 p-2 rounded bg-gray-700 text-white" />
          )}

          {!editingId && (
            <label className="flex items-center mb-3">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="mr-2" />
              ปักหมุดข่าวสาร
            </label>
          )}

          <button onClick={handleAddOrEditNews} className="w-full bg-green-600 py-2 rounded text-white hover:bg-blue-600 flex items-center justify-center gap-2">
            <PlusCircleIcon className="h-5 w-5" /> {editingId ? "บันทึกการแก้ไข" : "เพิ่มข่าวสาร"}
          </button>
        </div>

        {/* แสดงข่าวสาร */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item._id} className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg relative">
              <div className="relative w-full h-48">
                <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" className="rounded-lg" />
                {item.pinned && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">📌 ปักหมุด</div>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{item.content}</p>

              <button onClick={() => handleEditNews(item)} className="w-full bg-blue-500 py-2 rounded text-white hover:bg-blue-400 flex items-center justify-center gap-2 mb-2">
                <PencilSquareIcon className="h-5 w-5" /> แก้ไข
              </button>

              <button onClick={() => handleDeleteNews(item)} className="w-full bg-red-500 py-2 rounded text-white hover:bg-red-400 flex items-center justify-center gap-2">
                <TrashIcon className="h-5 w-5" /> ลบ
              </button>

              <button onClick={() => handleTogglePinned(item._id)} className="w-full bg-yellow-500 py-2 rounded text-white hover:bg-yellow-400 mt-2 flex items-center justify-center gap-2">
                {item.pinned ? "ถอนหมุด" : "ปักหมุด"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
