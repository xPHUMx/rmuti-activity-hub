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
import { TextField, Avatar, Typography, Box } from "@mui/material";
import { Home, Newspaper, ClipboardList } from "lucide-react";
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

  const hideNavbarRoutes = [
    "/login",
    "/admin/dashboard",
    "/admin/activities",
    "/admin/news",
    "/admin/manager-user",
    "/admin/users",
    "/admin/calendar",
  ];

  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  const handleEditProfile = async () => {
    if (!session?.user?.id) {
      MySwal.fire("ไม่พบข้อมูลผู้ใช้", "กรุณาล็อกอินใหม่", "error");
      return;
    }

    try {
      const res = await fetch(`/api/users/${session.user.id}`);
      if (!res.ok) {
        MySwal.fire("ไม่สามารถดึงข้อมูลได้", `API ส่งข้อผิดพลาด: ${res.statusText}`, "error");
        return;
      }

      const user = await res.json();
      if (!user) {
        MySwal.fire("ไม่พบข้อมูลผู้ใช้", "ไม่สามารถดึงข้อมูลได้", "error");
        return;
      }

      const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length > 10) return value;
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (!match) return cleaned;
        return [match[1], match[2], match[3]].filter(Boolean).join("-");
      };

      const ProfileForm = () => {
        const [phone, setPhone] = useState(user.phone || "");
        const [error, setError] = useState("");

        const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value.replace(/\D/g, "");
          if (value.length <= 10) {
            setPhone(formatPhoneNumber(value));
            setError(value.length === 10 ? "" : "เบอร์โทรศัพท์ต้องมี 10 ตัวเลข");
          }
        };

        return (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: 2, width: "100%", maxWidth: 400 }}>
            <Avatar
              src={user.image || "/img/default-profile.png"}
              alt="ภาพโปรไฟล์"
              sx={{ width: 100, height: 100, mb: 1 }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {user.email || "ไม่ระบุ"}
            </Typography>
            <TextField
              label="ชื่อ-นามสกุล"
              value={user.name || ""}
              disabled
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#e5e7eb", "& .MuiInputBase-input": { color: "#6b7280" } }}
            />
            <TextField
              label="รหัสนักศึกษา"
              value={user.studentId || ""}
              disabled
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#e5e7eb", "& .MuiInputBase-input": { color: "#6b7280" } }}
            />
            <TextField
              label="สาขา"
              value={user.department || ""}
              disabled
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#e5e7eb", "& .MuiInputBase-input": { color: "#6b7280" } }}
            />
            <TextField
              label="ชั้นปี/กลุ่มเรียน"
              value={user.year || ""}
              disabled
              fullWidth
              variant="outlined"
              sx={{ bgcolor: "#e5e7eb", "& .MuiInputBase-input": { color: "#6b7280" } }}
            />
            <TextField
              label="เบอร์โทรศัพท์"
              value={phone}
              onChange={handlePhoneChange}
              fullWidth
              variant="outlined"
              error={!!error}
              helperText={error}
              sx={{ bgcolor: "#ffffff", "& .MuiInputBase-input": { color: "#000000" } }}
              inputProps={{ id: "swal-input5", maxLength: 12 }}
            />
          </Box>
        );
      };

      MySwal.fire({
        title: "แก้ไขโปรไฟล์",
        html: <ProfileForm />,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "อัปเดตโปรไฟล์",
        cancelButtonText: "ยกเลิก",
        preConfirm: () => {
          const phone = (document.getElementById("swal-input5") as HTMLInputElement).value;
          const cleanedPhone = phone.replace(/\D/g, "");
          if (cleanedPhone.length !== 10) {
            MySwal.showValidationMessage("เบอร์โทรศัพท์ต้องมี 10 ตัวเลข");
            return false;
          }
          return { phone };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { phone } = result.value;

          fetch("/api/users/update-profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session?.user?.email,
              phone,
            }),
          })
            .then((response) => {
              if (response.ok) {
                MySwal.fire("สำเร็จ!", "โปรไฟล์ของคุณได้รับการอัปเดตแล้ว", "success");
              } else {
                MySwal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปเดตโปรไฟล์ได้", "error");
              }
            })
            .catch(() => {
              MySwal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถติดต่อ API ได้", "error");
            });
        }
      });
    } catch (error) {
      console.error("Edit profile error:", error);
      MySwal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่", "error");
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="luxury-loader mb-4" />
        </div>
      )}

      <nav className="bg-[#0c0a09]/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50 border-b border-white/[0.04]">
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
            <div className="hidden md:flex items-center bg-white/[0.01] border border-white/[0.03] p-1 rounded-full relative">
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
                          : "text-gray-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
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
              <button
                type="button"
                className="relative rounded-full p-2 text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all duration-300"
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
                    <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-black/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/[0.05] focus:outline-none overflow-hidden">
                      <div className="p-4 border-b border-white/[0.05] bg-white/[0.01]">
                        <div className="text-center">
                          <p className="text-xs font-light tracking-wider text-white mb-0.5">{session.user.name || "ผู้ใช้"}</p>
                          <p className="text-[10px] text-gray-500 truncate">{session.user.email || "ไม่ระบุอีเมล"}</p>
                        </div>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleEditProfile}
                              className={classNames(
                                active ? "bg-white/[0.04] text-orange-500" : "text-gray-300",
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
                                active ? "bg-white/[0.04] text-red-400" : "text-gray-300",
                                "flex items-center gap-2 w-full px-4 py-3 text-xs font-light tracking-wide transition-colors border-t border-white/[0.02]"
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
