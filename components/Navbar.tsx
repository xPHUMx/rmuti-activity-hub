"use client";

import RegistrationDropdown from "./RegistrationDropdown"; 
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import {
  BellAlertIcon,
  PencilSquareIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Home, Newspaper, ClipboardList, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";

const MySwal = withReactContent(Swal);

const navigation = [
  { name: "หน้าหลัก", href: "/", icon: Home },
  { name: "ข่าวสารกิจกรรม", href: "/news", icon: Newspaper },
  { name: "ลงทะเบียนกิจกรรม", href: "/register", icon: ClipboardList },
];

const tabVariants = {
  initial: {
    gap: 0,
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  animate: (isActive: boolean) => ({
    gap: isActive ? "0.5rem" : 0,
    paddingLeft: isActive ? "1.25rem" : "1rem",
    paddingRight: isActive ? "1.25rem" : "1rem",
  }),
};

const labelVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const springTransition = { type: "spring" as const, stiffness: 350, damping: 35 };

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/users/registrations?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error("ข้อมูลการลงทะเบียนได้");
        }
        const data = await response.json();

        // แปลงข้อมูลให้อยู่ในรูปแบบที่ dropdown ต้องการ พร้อมเพิ่ม onClick function
        // กรองเฉพาะที่มีข้อมูลกิจกรรม (ป้องกัน Error กรณี activityId เป็น null)
        const formattedRegs = data
          .filter((reg: any) => reg.activityId)
          .map((reg: any) => ({
          activityId: reg.activityId?._id,
          activityName: reg.activityId?.title || "ไม่ระบุชื่อกิจกรรม",
          startTime: reg.activityId?.activityStart ? new Date(reg.activityId.activityStart).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" }) : "-",
          endTime: reg.activityId?.activityEnd ? new Date(reg.activityId.activityEnd).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" }) : "-",
          location: reg.activityId?.location || "-",
          registerDate: new Date(reg.registrationDate).toLocaleDateString("th-TH"),
          onClick: (id: string) => {
            router.push(`/activities/${id}`);
          },
        }));

        setRegistrations(formattedRegs);
        setNotifications(formattedRegs.length);
      } catch (error) {
        console.error("ข้อผิดพลาดในการดึงข้อมูลการลงทะเบียน:", error);
      }
    };

    fetchRegistrations();
  }, [session, router]);

  // ปิด dropdown ถ้าคลิกนอกพื้นที่
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const clearNotifications = () => {
    setNotifications(0);
    setDropdownOpen(false);
  };

  const handleNavigation = async (href: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(href);
    setLoading(false);
  };

  // ซ่อน navbar ในทุกหน้า admin และหน้า login/profile-setup
  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/profile-setup") {
    return null;
  }

  const handleEditProfile = async () => {
    if (!session?.user?.id) {
      MySwal.fire({ title: "ไม่พบข้อมูลผู้ใช้", text: "กรุณาล็อกอินใหม่", icon: "error", background: "#0c0c0e", color: "#fff", confirmButtonColor: "#f97316" });
      return;
    }

    // Show loading
    MySwal.fire({
      title: "กำลังโหลดข้อมูล...",
      html: '<div style="display:flex;justify-content:center;padding:20px;"><div style="width:36px;height:36px;border:3px solid rgba(249,115,22,0.2);border-top:3px solid #f97316;border-radius:50%;animation:spin 0.8s linear infinite;"></div></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>',
      showConfirmButton: false,
      allowOutsideClick: false,
      background: "#0c0c0e",
      color: "#fff",
    });

    try {
      const res = await fetch(`/api/users/${session.user.id}`);
      if (!res.ok) {
        MySwal.fire({ title: "ไม่สามารถดึงข้อมูลได้", text: `API Error: ${res.statusText}`, icon: "error", background: "#0c0c0e", color: "#fff", confirmButtonColor: "#f97316" });
        return;
      }

      const user = await res.json();
      if (!user) {
        MySwal.fire({ title: "ไม่พบข้อมูลผู้ใช้", text: "ไม่สามารถดึงข้อมูลได้", icon: "error", background: "#0c0c0e", color: "#fff", confirmButtonColor: "#f97316" });
        return;
      }

      const currentPhone = user.phone || "";

      MySwal.fire({
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:8px 0;">
            <!-- Profile Avatar -->
            <div style="position:relative;">
              <div style="width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,#f97316,#ea580c);padding:3px;">
                <img src="${user.image || '/img/default-profile.png'}" alt="profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:3px solid #0c0c0e;" />
              </div>
              <div style="position:absolute;bottom:2px;right:2px;width:20px;height:20px;background:#22c55e;border:3px solid #0c0c0e;border-radius:50%;"></div>
            </div>

            <!-- Name & Email -->
            <div style="text-align:center;">
              <p style="font-size:16px;font-weight:700;color:#fff;margin:0 0 4px 0;">${user.name || 'ผู้ใช้'}</p>
              <p style="font-size:11px;color:#9ca3af;margin:0;letter-spacing:0.5px;">${user.email || 'ไม่ระบุอีเมล'}</p>
            </div>

            <!-- Info Cards -->
            <div style="width:100%;display:flex;flex-direction:column;gap:10px;margin-top:4px;">
              <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:12px 16px;">
                <div style="width:36px;height:36px;border-radius:10px;background:rgba(249,115,22,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <div style="text-align:left;">
                  <p style="font-size:10px;color:#6b7280;margin:0;text-transform:uppercase;letter-spacing:1px;">รหัสนักศึกษา</p>
                  <p style="font-size:13px;color:#e5e7eb;margin:2px 0 0;font-weight:500;">${user.studentId || '—'}</p>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:12px 16px;">
                <div style="width:36px;height:36px;border-radius:10px;background:rgba(249,115,22,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 10 3 12 0v-5"/></svg>
                </div>
                <div style="text-align:left;">
                  <p style="font-size:10px;color:#6b7280;margin:0;text-transform:uppercase;letter-spacing:1px;">สาขา</p>
                  <p style="font-size:13px;color:#e5e7eb;margin:2px 0 0;font-weight:500;">${user.department || '—'}</p>
                </div>
              </div>

              <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:12px 16px;">
                <div style="width:36px;height:36px;border-radius:10px;background:rgba(249,115,22,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <div style="text-align:left;">
                  <p style="font-size:10px;color:#6b7280;margin:0;text-transform:uppercase;letter-spacing:1px;">ชั้นปี / กลุ่มเรียน</p>
                  <p style="font-size:13px;color:#e5e7eb;margin:2px 0 0;font-weight:500;">${user.year || '—'}</p>
                </div>
              </div>
            </div>

            <!-- Editable Phone -->
            <div style="width:100%;margin-top:4px;">
              <label style="display:block;font-size:11px;color:#9ca3af;margin-bottom:6px;text-align:left;font-weight:500;letter-spacing:0.5px;">เบอร์โทรศัพท์ (แก้ไขได้)</label>
              <div style="position:relative;">
                <div style="position:absolute;left:14px;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:10px;background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <input id="swal-input-phone" type="tel" maxlength="12" value="${currentPhone}" placeholder="0XX-XXX-XXXX" style="width:100%;padding:14px 16px 14px 62px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#fff;font-size:14px;font-weight:500;outline:none;transition:border-color 0.3s;box-sizing:border-box;" onfocus="this.style.borderColor='#f97316'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'" oninput="let v=this.value.replace(/\\D/g,'');if(v.length>10)v=v.slice(0,10);let f=v;if(v.length>6)f=v.slice(0,3)+'-'+v.slice(3,6)+'-'+v.slice(6);else if(v.length>3)f=v.slice(0,3)+'-'+v.slice(3);this.value=f;" />
              </div>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>อัปเดตโปรไฟล์</span>',
        cancelButtonText: 'ยกเลิก',
        background: "#0c0c0e",
        color: "#ffffff",
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#374151",
        showCloseButton: true,
        customClass: {
          popup: 'profile-edit-popup',
          confirmButton: 'profile-edit-confirm',
          cancelButton: 'profile-edit-cancel',
        },
        focusConfirm: false,
        preConfirm: () => {
          const phoneInput = document.getElementById("swal-input-phone") as HTMLInputElement;
          const phone = phoneInput?.value || "";
          const cleaned = phone.replace(/\D/g, "");
          if (cleaned.length !== 10) {
            MySwal.showValidationMessage("เบอร์โทรศัพท์ต้องมี 10 ตัวเลข");
            return false;
          }
          return { phone };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { phone } = result.value;

          // Show saving indicator
          MySwal.fire({
            title: "กำลังบันทึก...",
            html: '<div style="display:flex;justify-content:center;padding:20px;"><div style="width:36px;height:36px;border:3px solid rgba(249,115,22,0.2);border-top:3px solid #f97316;border-radius:50%;animation:spin 0.8s linear infinite;"></div></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>',
            showConfirmButton: false,
            allowOutsideClick: false,
            background: "#0c0c0e",
            color: "#fff",
          });

          fetch("/api/users/update-profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session?.user?.email, phone }),
          })
            .then((response) => {
              if (response.ok) {
                MySwal.fire({
                  title: "สำเร็จ!",
                  text: "โปรไฟล์ของคุณได้รับการอัปเดตแล้ว",
                  icon: "success",
                  background: "#0c0c0e",
                  color: "#fff",
                  confirmButtonColor: "#f97316",
                  timer: 2000,
                  timerProgressBar: true,
                });
              } else {
                MySwal.fire({ title: "เกิดข้อผิดพลาด!", text: "ไม่สามารถอัปเดตโปรไฟล์ได้", icon: "error", background: "#0c0c0e", color: "#fff", confirmButtonColor: "#f97316" });
              }
            })
            .catch(() => {
              MySwal.fire({ title: "เกิดข้อผิดพลาด!", text: "ไม่สามารถติดต่อ API ได้", icon: "error", background: "#0c0c0e", color: "#fff", confirmButtonColor: "#f97316" });
            });
        }
      });
    } catch (error) {
      console.error("Edit profile error:", error);
      MySwal.fire({ title: "เกิดข้อผิดพลาด!", text: "ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่", icon: "error", background: "#0c0c0e", color: "#fff", confirmButtonColor: "#f97316" });
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="luxury-loader mb-4" />
        </div>
      )}

      <nav className="bg-white/95 dark:bg-[#0c0a09]/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50 border-b border-gray-200 dark:border-white/[0.04] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/img/logohaed1.png"
                alt="โลโก้"
                width={120}
                height={120}
                priority
                className="object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Desktop Navigation (Center) */}
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.03] p-1 rounded-full relative transition-colors duration-300">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className="no-underline relative"
                  >
                    <motion.div
                      variants={tabVariants}
                      initial={false}
                      animate="animate"
                      custom={isActive}
                      transition={springTransition}
                      className={classNames(
                        "relative flex items-center rounded-full py-1.5 cursor-pointer text-xs font-light tracking-wider transition-colors",
                        isActive
                          ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/[0.02] border border-transparent"
                      )}
                    >
                      <Icon size={14} strokeWidth={2} />
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.span
                            variants={labelVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={springTransition}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tubelight Lamp active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="lamp-desktop"
                          className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-orange-500 rounded-b-full z-10"
                          initial={false}
                          transition={{
                            type: "spring" as const,
                            stiffness: 350,
                            damping: 30,
                          }}
                        >
                          <div className="absolute w-10 h-4 bg-orange-500/30 rounded-full blur-sm -top-1 -left-1" />
                        </motion.div>
                      )}
                    </motion.div>
                  </button>
                );
              })}
            </div>

            {/* Notifications & Profile (Right) */}
            <div className="relative flex items-center space-x-4" ref={dropdownRef}>
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="relative rounded-full p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-all duration-300"
                aria-label="สลับโหมดสี"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-orange-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-500" />
                )}
              </button>

              <button
                type="button"
                className="relative rounded-full p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-all duration-300"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="ดูการแจ้งเตือน"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <BellAlertIcon className="h-5 w-5" aria-hidden="true" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[9px] font-semibold text-black bg-orange-500 rounded-full">
                    {notifications}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <RegistrationDropdown
                  registrations={registrations}
                  onClose={() => setDropdownOpen(false)}
                />
              )}

              {session ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex rounded-full bg-white/[0.02] text-sm focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:ring-offset-1 focus:ring-offset-black transition-all duration-300">
                    <span className="sr-only">เปิดเมนูผู้ใช้</span>
                    <Image
                      className="rounded-full border border-white/[0.08]"
                      src={session.user.image || "/img/default-profile.png"}
                      alt="ภาพโปรไฟล์"
                      width={32}
                      height={32}
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white dark:bg-black/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-gray-200 dark:border-white/[0.05] focus:outline-none overflow-hidden transition-colors duration-300">
                      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.01]">
                        <div className="text-center">
                          <p className="text-xs font-light tracking-wider text-gray-900 dark:text-white mb-0.5">{session.user.name || "ผู้ใช้"}</p>
                          <p className="text-[10px] text-gray-600 dark:text-gray-500 truncate">{session.user.email || "ไม่ระบุอีเมล"}</p>
                        </div>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleEditProfile}
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-white/[0.04] text-orange-500" : "text-gray-700 dark:text-gray-300",
                                "flex items-center gap-2 w-full px-4 py-3 text-xs font-light tracking-wide transition-colors"
                              )}
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              แก้ไขโปรไฟล์
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
                              className={classNames(
                                active ? "bg-gray-100 dark:bg-white/[0.04] text-red-400" : "text-gray-700 dark:text-gray-300",
                                "flex items-center gap-2 w-full px-4 py-3 text-xs font-light tracking-wide transition-colors border-t border-gray-200 dark:border-white/[0.02]"
                              )}
                            >
                              <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
                              ออกจากระบบ
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="border border-orange-500/30 hover:border-orange-500 text-gray-300 hover:text-black hover:bg-orange-500 rounded-full px-5 py-1.5 text-xs font-light tracking-wider transition-all duration-500"
                  aria-label="เข้าสู่ระบบ"
                >
                  เข้าสู่ระบบ
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <div className="flex justify-center items-center gap-2 bg-black/80 border border-white/[0.06] backdrop-blur-xl py-2 px-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="relative flex items-center justify-center flex-1"
              >
                <motion.div
                  variants={tabVariants}
                  initial={false}
                  animate="animate"
                  custom={isActive}
                  transition={springTransition}
                  className={classNames(
                    "relative flex items-center justify-center rounded-full py-2 px-3.5 cursor-pointer text-xs font-light tracking-wider transition-all",
                    isActive
                      ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 gap-2"
                      : "text-gray-400 hover:text-white gap-0"
                  )}
                >
                  <Icon size={16} strokeWidth={2} />
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        variants={labelVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={springTransition}
                        className="overflow-hidden whitespace-nowrap text-[10px]"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tubelight Lamp active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="lamp-mobile"
                      className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-orange-500 rounded-b-full z-10"
                      initial={false}
                      transition={{
                        type: "spring" as const,
                        stiffness: 350,
                        damping: 30,
                      }}
                    >
                      <div className="absolute w-10 h-4 bg-orange-500/30 rounded-full blur-sm -top-1 -left-1" />
                    </motion.div>
                  )}
                </motion.div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
