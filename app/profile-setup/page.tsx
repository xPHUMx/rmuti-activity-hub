"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Image from "next/image";
import { LogOut, ArrowRight, UserCheck } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

// ตัวเลือกสาขาและคำนำหน้า
const branchOptions: string[] = ["วิศวกรรมคอมพิวเตอร์", "วิศวกรรมไฟฟ้า"];
const titleOptions: string[] = ["นาย", "นาง", "นางสาว"];

export default function ProfileSetup() {
  const { theme } = useTheme();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    studentId: "",
    department: "",
    phone: "",
  });
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const formatStudentId = (v: string) => v.replace(/\D/g, "").replace(/^(.{11})(.)/, "$1-$2");
  const formatPhone = (v: string) => v.replace(/\D/g, "").replace(/^(.{3})(.{3})(.{0,4})$/, "$1-$2-$3");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "studentId") setFormData({ ...formData, studentId: formatStudentId(value) });
    else if (name === "phone") setFormData({ ...formData, phone: formatPhone(value) });
    else setFormData({ ...formData, [name]: value });
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    setFormData({ ...formData, department: branch });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      Swal.fire({
        icon: "error",
        title: "กรุณาล็อกอินใหม่",
        text: "คุณต้องล็อกอินเพื่อบันทึกข้อมูล",
        confirmButtonColor: "#f97316",
        background: theme === "dark" ? "#0c0c0e" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937"
      });
      return;
    }

    const fullNameWithTitle = `${formData.title} ${formData.fullName}`.trim();

    const res = await fetch("/api/users/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        fullName: fullNameWithTitle,
        studentId: formData.studentId.trim(),
        department: formData.department.trim(),
        phone: formData.phone.trim(),
      }),
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        text: "โปรดเข้าสู่ระบบใหม่อีกครั้ง",
        confirmButtonColor: "#f97316",
        background: theme === "dark" ? "#0c0c0e" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937"
      }).then(() =>
        signOut({ callbackUrl: "/login" })
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#f97316",
        background: theme === "dark" ? "#0c0c0e" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#1f2937"
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] px-4 transition-colors duration-300 font-sarabun overflow-hidden">
      {/* วงกลมแสงออร่าพื้นหลัง */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/80 dark:bg-[#0a0a0bf0] border border-gray-200 dark:border-white/[0.04] p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 flex flex-col relative z-10"
      >
        {/* โลโก้ RMUTI */}
        <div className="flex justify-center mb-6">
          <div className="relative w-36 h-12">
            <Image
              src="/img/logohaed1.png"
              alt="RMUTI Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        <h2 className="text-[10px] tracking-[0.25em] font-light text-orange-500 uppercase text-center mb-1">
          Student Profile Setup
        </h2>
        <h1 className="text-xl font-light text-center text-gray-808 dark:text-gray-200 tracking-wide mb-8">
          กรอกข้อมูลนักศึกษาเพื่อเริ่มต้นใช้งาน
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* แถว 1: คำนำหน้า และ ชื่อ-นามสกุล */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
                คำนำหน้า <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-white dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-800 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300 cursor-pointer"
                required
              >
                <option value="" disabled>— คำนำหน้า —</option>
                {titleOptions.map((t) => (
                  <option key={t} value={t} className="bg-white dark:bg-[#0f0f10] text-gray-800 dark:text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
                ชื่อ-นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="กรอกชื่อและนามสกุล..."
                value={formData.fullName}
                onChange={handleTextChange}
                className="w-full bg-white dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-850 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300"
                required
              />
            </div>
          </div>

          {/* รหัสนักศึกษา */}
          <div>
            <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
              รหัสนักศึกษา <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="studentId"
              maxLength={13}
              placeholder="กรอกรหัสนักศึกษา 13 หลัก (เช่น 64332110xxx-x)..."
              value={formData.studentId}
              onChange={handleTextChange}
              className="w-full bg-white dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-850 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300 font-mono tracking-wider"
              required
            />
          </div>

          {/* สาขา */}
          <div>
            <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
              สาขาวิชา <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="w-full bg-white dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-800 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300 cursor-pointer"
              required
            >
              <option value="" disabled>— เลือกสาขาวิชา —</option>
              {branchOptions.map((b) => (
                <option key={b} value={b} className="bg-white dark:bg-[#0f0f10] text-gray-800 dark:text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* เบอร์โทร */}
          <div>
            <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              maxLength={12}
              placeholder="กรอกเบอร์โทรศัพท์ติดต่อ (เช่น 089-xxx-xxxx)..."
              value={formData.phone}
              onChange={handleTextChange}
              className="w-full bg-white dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-850 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300 font-mono"
              required
            />
          </div>

          {/* ปุ่มบันทึก */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-black text-xs font-medium tracking-widest py-4 px-6 rounded-2xl shadow-[0_5px_15px_rgba(249,115,22,0.15)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all duration-300 flex items-center justify-center gap-2 mt-4 group"
            >
              <UserCheck className="h-4 w-4" />
              <span>บันทึกข้อมูลเพื่อเข้าสู่ระบบ</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        {/* ปุ่มยกเลิก/ออกจากระบบ */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center gap-2 mt-6 text-xs font-light text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 mx-auto"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>ออกจากระบบ / ยกเลิก</span>
        </button>
      </motion.div>
    </div>
  );
}