"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { 
  PlusCircle, 
  Trash, 
  Pencil, 
  Pin, 
  PinOff,
  Image as ImageIcon,
  CheckCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      const data: NewsItem[] = await res.json();
      const sorted = data.sort((a, b) => {
        if (a.pinned === b.pinned) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return b.pinned ? 1 : -1;
      });
      setNews(sorted);
    } catch (error) {
      console.error(error);
    }
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
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอกหัวข้อและเนื้อหาข่าวสาร",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (editingId) {
        // โหมดแก้ไข
        const res = await fetch("/api/news", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, title, content }),
        });

        if (res.ok) {
          Swal.fire({ 
            icon: "success", 
            title: "แก้ไขข่าวสำเร็จ!", 
            timer: 1500, 
            showConfirmButton: false,
            background: "#0c0c0e",
            color: "#ffffff"
          });
          fetchNews();
          resetForm();
        } else {
          throw new Error("Edit failed");
        }
      } else {
        // โหมดเพิ่ม
        if (!file) {
          Swal.fire({ 
            icon: "warning", 
            title: "กรุณาเลือกรูปภาพ",
            confirmButtonColor: "#f97316",
            background: "#0c0c0e",
            color: "#ffffff"
          });
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("pinned", JSON.stringify(pinned));

        const res = await fetch("/api/news", { method: "POST", body: formData });

        if (res.ok) {
          Swal.fire({ 
            icon: "success", 
            title: "เพิ่มข่าวสารสำเร็จ!", 
            timer: 1500, 
            showConfirmButton: false,
            background: "#0c0c0e",
            color: "#ffffff"
          });
          fetchNews();
          resetForm();
        } else {
          throw new Error("Add failed");
        }
      }
    } catch {
      Swal.fire({ 
        icon: "error", 
        title: "เกิดข้อผิดพลาด", 
        text: "ไม่สามารถดำเนินการได้ในขณะนี้",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNews = async (item: NewsItem) => {
    const confirm = await Swal.fire({
      title: item.pinned ? "ข่าวนี้ถูกปักหมุดอยู่ ต้องการลบจริงหรือไม่?" : "คุณต้องการลบข่าวสารนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3f3f46",
      background: "#0c0c0e",
      color: "#ffffff",
      customClass: {
        popup: 'border border-white/[0.08] rounded-3xl p-6 shadow-2xl'
      }
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item._id }),
      });

      if (res.ok) {
        Swal.fire({ 
          icon: "success", 
          title: "ลบข่าวสารสำเร็จ!", 
          timer: 1500, 
          showConfirmButton: false,
          background: "#0c0c0e",
          color: "#ffffff"
        });
        fetchNews();
      } else {
        throw new Error("Delete failed");
      }
    } catch {
      Swal.fire({ 
        icon: "error", 
        title: "เกิดข้อผิดพลาด", 
        text: "ไม่สามารถลบข่าวสารได้",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
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
        Swal.fire({ 
          icon: "success", 
          title: data.pinned ? "ปักหมุดสำเร็จ" : "ถอนหมุดสำเร็จ", 
          timer: 1500, 
          showConfirmButton: false,
          background: "#0c0c0e",
          color: "#ffffff"
        });
        fetchNews();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      Swal.fire({ 
        icon: "error", 
        title: "เกิดข้อผิดพลาด", 
        text: err.message || "ไม่สามารถเปลี่ยนการปักหมุดได้",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#080808] text-white px-4 py-12 md:py-20 font-sarabun">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* หัวข้อ */}
        <div className="space-y-2 select-none">
          <h2 className="text-[10px] tracking-[0.25em] font-light text-orange-500 uppercase">
            NEWS CONFIGURATION
          </h2>
          <h1 className="text-2xl font-light text-gray-200 tracking-wide">
            จัดการและสร้างข่าวประชาสัมพันธ์
          </h1>
        </div>

        {/* ฟอร์มเขียนข่าว */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-2xl mx-auto space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-white/[0.04] pb-4">
            <PlusCircle className="h-5 w-5 text-orange-500/80" />
            <h2 className="text-sm font-light tracking-wide text-gray-200">
              {editingId ? "แก้ไขรายละเอียดข่าวสาร" : "เขียนข่าวสารประชาสัมพันธ์ใหม่"}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="ml-auto text-xs font-light text-gray-500 hover:text-white flex items-center gap-1">
                <X className="h-3 w-3" /> ยกเลิก
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-wider text-gray-500 uppercase mb-2">หัวข้อข่าวสาร</label>
              <input
                type="text"
                placeholder="กรอกชื่อหัวข้อข่าวสาร..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0f0f10] border border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-white rounded-2xl p-3.5 focus:outline-none transition duration-300"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-wider text-gray-500 uppercase mb-2">เนื้อหาข่าวสาร</label>
              <textarea
                placeholder="กรอกเนื้อหารายละเอียดข่าวสารที่นี่..."
                value={content}
                rows={5}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#0f0f10] border border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-white rounded-2xl p-3.5 focus:outline-none transition duration-300"
              />
            </div>

            {!editingId && (
              <div>
                <label className="block text-[10px] tracking-wider text-gray-500 uppercase mb-2">รูปภาพหน้าปก</label>
                <div className="relative w-full bg-[#0f0f10] border border-dashed border-white/[0.08] hover:border-orange-500/20 rounded-2xl p-6 transition duration-300 flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="h-6 w-6 text-gray-500 mb-2" />
                  <span className="text-xs font-light text-gray-400">
                    {file ? file.name : "เลือกรูปภาพประกอบข่าวสาร"}
                  </span>
                </div>
              </div>
            )}

            {!editingId && (
              <label className="flex items-center gap-2 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded border-white/[0.08] bg-[#0f0f10] text-orange-500 focus:ring-0 cursor-pointer h-4 w-4"
                />
                <span className="text-xs font-light text-gray-400 hover:text-white transition">ปักหมุดเป็นข่าวแนะนำหลัก</span>
              </label>
            )}

            <button
              onClick={handleAddOrEditNews}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-black text-xs font-medium tracking-widest py-3.5 px-6 rounded-2xl shadow-[0_5px_15px_rgba(249,115,22,0.15)] transition duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>{editingId ? "บันทึกการแก้ไข" : "สร้างและอัปเดตข่าวสาร"}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* แสดงรายการข่าว */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 select-none">
            <div className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
            <h2 className="text-xs font-light tracking-[0.2em] text-gray-400 uppercase">ข่าวสารทั้งหมดในระบบ / News Directory</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {news.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl p-5 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-orange-500/20 transition-all duration-300 flex flex-col justify-between h-[420px]"
                >
                  <div className="space-y-4">
                    {/* Cover image */}
                    <div className="relative w-full h-40 overflow-hidden rounded-2xl bg-white/[0.01]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-2xl transition duration-500 hover:scale-105"
                      />
                      {item.pinned && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-black text-[9px] font-medium px-2.5 py-1 rounded-lg tracking-wider flex items-center gap-1 shadow-md">
                          <Pin className="h-2.5 w-2.5" />
                          <span>PINNED</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-light text-gray-100 line-clamp-1 group-hover:text-white transition">
                        {item.title}
                      </h3>
                      <p className="text-xs font-light text-gray-500 line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-white/[0.03] select-none">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEditNews(item)}
                        className="flex items-center justify-center gap-1 px-3 py-2 border border-white/[0.08] hover:bg-white/[0.03] text-[10px] font-light tracking-wider rounded-xl transition duration-300 text-gray-300 hover:text-white"
                      >
                        <Pencil className="h-3 w-3 text-orange-500/80" />
                        <span>แก้ไข</span>
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item)}
                        className="flex items-center justify-center gap-1 px-3 py-2 border border-red-500/10 hover:bg-red-500/10 text-[10px] font-light tracking-wider rounded-xl transition duration-300 text-gray-400 hover:text-red-400"
                      >
                        <Trash className="h-3 w-3" />
                        <span>ลบ</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleTogglePinned(item._id)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] text-[10px] font-light tracking-wider rounded-xl transition duration-300 text-gray-300"
                    >
                      {item.pinned ? (
                        <>
                          <PinOff className="h-3 w-3 text-orange-500/80" />
                          <span>ถอนการปักหมุด</span>
                        </>
                      ) : (
                        <>
                          <Pin className="h-3 w-3 text-orange-500/80" />
                          <span>ปักหมุดเป็นข่าวแนะนำ</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
