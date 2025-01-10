
// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// // กำหนด type ของ Image
// interface ImageType {
//   _id: string;
//   url: string;
//   title: string;
// }

// export default function AdminDashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [file, setFile] = useState<File | null>(null);
//   const [title, setTitle] = useState("");
//   const [images, setImages] = useState<ImageType[]>([]); // ใช้ ImageType เป็นประเภทของ state
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (status === "unauthenticated" || (session?.user && session.user.role !== "admin")) {
//       router.push("/login");
//     }
//   }, [status, session, router]);

//   const fetchImages = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/upload");
//       if (res.ok) {
//         const data: ImageType[] = await res.json();
//         setImages(data);
  
//         if (data.length === 0) {
//           alert("ไม่มีรูปภาพในระบบ กรุณาอัปโหลดรูปภาพใหม่");
//         }
//       } else {
//         console.error("Error fetching images");
//       }
//     } catch (error) {
//       console.error("Error fetching images:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchImages();
//   }, []);

//   const handleUpload = async () => {
//     if (!file || !title) {
//       alert("กรุณาเลือกไฟล์และกรอกชื่อ");
//       return;
//     }
  
//     if (!file.type.startsWith("image/")) {
//       alert("ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น");
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", title);
  
//     try {
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });
  
//       if (res.ok) {
//         alert("อัปโหลดสำเร็จ!");
//         fetchImages();
//         setFile(null);
//         setTitle("");
//       } else {
//         alert("เกิดข้อผิดพลาดในการอัปโหลด");
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("เกิดข้อผิดพลาดในการอัปโหลด");
//     }
//   };
  

//   const handleDelete = async (id: string) => {
//     const confirmDelete = confirm("คุณต้องการลบรูปภาพนี้ใช่หรือไม่?");
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch("/api/upload", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       if (res.ok) {
//         alert("ลบรูปภาพสำเร็จ!");
//         setImages((prev) => prev.filter((image) => image._id !== id)); // TypeScript จะเข้าใจ `_id` หลังเพิ่ม type
//       } else {
//         alert("เกิดข้อผิดพลาดในการลบรูปภาพ");
//       }
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       alert("เกิดข้อผิดพลาดในการลบรูปภาพ");
//     }
//   };

//   if (status === "loading" || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
//         กำลังโหลด...
//       </div>
//     );
//   }

//   return (
//     <div
//       className="p-8 min-h-screen text-white"
//       style={{ backgroundImage: "url('/img/PC screen 2.png')", backgroundSize: "cover" }}
//     >
//       <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold mb-6 text-center">จัดการรูปภาพ</h1>

//         <div className="mb-8">
//           <input
//             type="text"
//             placeholder="ชื่อรูปภาพ"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="p-2 mb-4 w-full rounded bg-gray-700 text-white"
//           />
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//             className="p-2 mb-4 w-full text-white file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded hover:file:bg-red-400"
//           />
//           <button
//             onClick={handleUpload}
//             className="bg-orange-700 py-2 px-6 rounded text-white hover:bg-red-500 disabled:opacity-50"
//             disabled={loading || !file || !title}
//           >
//             อัปโหลด
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {images.map((image) => (
//             <div key={image._id} className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-md">
//               <Image
//                 src={image.url}
//                 alt={image.title}
//                 width={400}
//                 height={160}
//                 className="object-cover rounded-lg"
//               />
//               <h3 className="mt-2 text-center font-bold text-white">{image.title}</h3>
//               <button
//                 onClick={() => handleDelete(image._id)}
//                 className="mt-4 bg-red-500 py-1 px-4 rounded text-white hover:bg-red-400 w-full"
//                 disabled={loading}
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowUpOnSquareIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Swal from "sweetalert2";

// กำหนด type ของ Image
interface ImageType {
  _id: string;
  url: string;
  title: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && session.user.role !== "admin")) {
      router.push("/login");
    }
  }, [status, session, router]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      if (res.ok) {
        const data: ImageType[] = await res.json();
        setImages(data);
        if (data.length === 0) {
          Swal.fire({
            icon: "info",
            title: "ไม่มีรูปภาพ",
            text: "กรุณาอัปโหลดรูปภาพใหม่",
          });
        }
      } else {
        console.error("Error fetching images");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!file || !title) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณาเลือกไฟล์และกรอกชื่อ",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "ไฟล์ไม่ถูกต้อง",
        text: "ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "อัปโหลดสำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchImages();
        setFile(null);
        setTitle("");
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการอัปโหลด",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการอัปโหลด",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = await Swal.fire({
      title: "คุณต้องการลบรูปภาพนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "ลบรูปภาพสำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
        setImages((prev) => prev.filter((image) => image._id !== id));
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดในการลบรูปภาพ",
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการลบรูปภาพ",
      });
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div
      className="p-8 min-h-screen text-white"
      style={{ backgroundImage: "url('/img/PC screen 2.png')", backgroundSize: "cover" }}
    >
      <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">จัดการรูปภาพ</h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="ชื่อรูปภาพ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 mb-4 w-full rounded bg-gray-700 text-white"
          />
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="p-2 w-full text-white file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded hover:file:bg-red-600"
            />
            <button
              onClick={handleUpload}
              className="flex w-full items-center gap-2 bg-orange-700 py-2 px-6 rounded text-white hover:bg-red-900 disabled:opacity-50"
              disabled={loading || !file || !title}
            >
              <ArrowUpOnSquareIcon className="h-5 w-5" /> เพิ่มรูปภาพ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image._id} className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-md">
              <Image
                src={image.url}
                alt={image.title}
                width={400}
                height={160}
                className="object-cover rounded-lg"
              />
              <h3 className="mt-2 text-center font-bold text-white flex items-center justify-center gap-2">
                <PhotoIcon className="h-5 w-5" /> {image.title}
              </h3>
              <button
                onClick={() => handleDelete(image._id)}
                className="mt-4 flex items-center justify-center gap-2 bg-red-500 py-1 px-4 rounded text-white hover:bg-red-400 w-full"
                disabled={loading}
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
