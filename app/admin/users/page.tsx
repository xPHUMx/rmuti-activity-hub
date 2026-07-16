"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { 
  User as UserIcon, 
  Mail, 
  GraduationCap, 
  ShieldAlert, 
  Eye, 
  Check, 
  Search 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MySwal = withReactContent(Swal);

interface UserData {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  department?: string;
  program?: string;
  year?: string;
  phone?: string;
  role: string;
  image?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      });
  }, []);

  // ฟังก์ชันแสดงรายละเอียดผู้ใช้
  const fetchUserDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const user = await res.json();
    
      MySwal.fire({
        title: `<strong class="text-white font-light text-lg">รายละเอียดนักศึกษา</strong>`,
        html: `
          <div style="text-align: left; font-size: 14px; color: #d1d5db; font-family: sans-serif;" class="space-y-3 font-light">
            <p><strong>ชื่อ-นามสกุล:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>รหัสนักศึกษา:</strong> ${user.studentId || "-"}</p>
            <p><strong>สาขา:</strong> ${user.department || "-"}</p>
            <p><strong>ภาค:</strong> ${user.program || "-"}</p>
            <p><strong>ปีการศึกษา:</strong> ${user.year || "-"}</p>
            <p><strong>เบอร์โทร:</strong> ${user.phone || "-"}</p>
            <p><strong>บทบาท:</strong> <span class="text-orange-500 font-normal">${user.role.toUpperCase()}</span></p>
          </div>
        `,
        confirmButtonText: "ปิด",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff",
        customClass: {
          popup: 'border border-white/[0.08] rounded-3xl p-6 shadow-2xl',
          confirmButton: 'px-6 py-2.5 rounded-xl font-light text-xs tracking-wider'
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "ข้อผิดพลาด", text: "ไม่สามารถโหลดรายละเอียดผู้ใช้ได้" });
    }
  };

  // ฟังก์ชันอัปเดตบทบาทผู้ใช้
  const updateUserRole = async (id: string, newRole: string) => {
    const result = await MySwal.fire({
      title: "ยืนยันการเปลี่ยนบทบาท?",
      text: `คุณต้องการเปลี่ยนบทบาทผู้ใช้เป็น "${newRole}" หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      background: "#0c0c0e",
      color: "#ffffff",
      customClass: {
        popup: 'border border-white/[0.08] rounded-3xl p-6 shadow-2xl',
        confirmButton: 'px-6 py-2.5 rounded-xl font-light text-xs tracking-wider',
        cancelButton: 'px-6 py-2.5 rounded-xl font-light text-xs tracking-wider'
      }
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, role: newRole }),
        });

        if (res.ok) {
          setUsers(users.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
          MySwal.fire({
            icon: "success",
            title: "สำเร็จ!",
            text: "บทบาทของผู้ใช้ถูกอัปเดตแล้ว",
            confirmButtonColor: "#f97316",
            background: "#0c0c0e",
            color: "#ffffff",
            customClass: {
              popup: 'border border-white/[0.08] rounded-3xl p-6 shadow-2xl'
            }
          });
        } else {
          throw new Error("Patch failed");
        }
      } catch {
        MySwal.fire({
          icon: "error",
          title: "ผิดพลาด!",
          text: "ไม่สามารถอัปเดตบทบาทได้",
          confirmButtonColor: "#f97316",
          background: "#0c0c0e",
          color: "#ffffff",
          customClass: {
            popup: 'border border-white/[0.08] rounded-3xl p-6 shadow-2xl'
          }
        });
      }
    }
  };

  // กรองผู้ใช้ตามการค้นหา
  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.studentId && u.studentId.includes(searchQuery))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white transition-colors duration-300">
        <div className="luxury-loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white px-4 py-12 md:py-20 font-sarabun transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* หัวข้อ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
          <div className="space-y-2">
            <h2 className="text-[10px] tracking-[0.25em] font-light text-orange-500 uppercase">
              USER CONFIGURATION
            </h2>
            <h1 className="text-2xl font-light text-gray-800 dark:text-gray-200 tracking-wide">
              จัดการและกำหนดสิทธิ์ผู้ใช้งาน
            </h1>
          </div>
          
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 animate-pulse" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, รหัสนักศึกษา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.06] focus:border-orange-500/40 text-xs font-light text-gray-800 dark:text-white rounded-xl focus:outline-none transition duration-300 shadow-sm"
            />
          </div>
        </div>

        {/* ตารางแสดงผู้ใช้ */}
        <div className="bg-white dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/[0.04] select-none">
                  <th className="p-4 pl-6 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="p-4 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">
                    อีเมล (Email)
                  </th>
                  <th className="p-4 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">
                    รหัสนักศึกษา
                  </th>
                  <th className="p-4 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">
                    สิทธิ์การใช้งาน
                  </th>
                  <th className="p-4 pr-6 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase text-center">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-650 dark:text-gray-500 font-light text-sm">
                        ไม่พบข้อมูลผู้ใช้งาน
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <motion.tr 
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        className="border-b border-gray-100 dark:border-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.01] transition duration-300"
                      >
                        <td className="p-4 pl-6 text-sm font-light text-gray-800 dark:text-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] flex items-center justify-center overflow-hidden relative">
                              {user.image ? (
                                <Image
                                  src={user.image}
                                  alt={user.name}
                                  width={28}
                                  height={28}
                                  className="object-cover h-full w-full"
                                />
                              ) : (
                                <UserIcon className="h-3.5 w-3.5 text-gray-550 dark:text-gray-400" />
                              )}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-light text-gray-650 dark:text-gray-400 select-all">
                          {user.email}
                        </td>
                        <td className="p-4 text-xs font-light text-gray-650 dark:text-gray-400">
                          {user.studentId || "-"}
                        </td>
                        <td className="p-4">
                          <select
                            className="bg-white dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] text-xs font-light text-gray-700 dark:text-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-500/50 cursor-pointer transition duration-300"
                            value={user.role}
                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                          >
                            <option value="user">USER</option>
                            <option value="admin">ADMIN</option>
                          </select>
                        </td>
                        <td className="p-4 pr-6 text-center">
                          <button
                            onClick={() => fetchUserDetails(user._id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.03] text-xs font-light tracking-wide rounded-xl transition duration-300 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white shadow-sm dark:shadow-none"
                          >
                            <Eye className="h-3.5 w-3.5 text-orange-500/80" />
                            <span>ดูรายละเอียด</span>
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
