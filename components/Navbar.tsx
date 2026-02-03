

"use client";

import RegistrationDropdown from "./RegistrationDropdown"; 
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  Bars3Icon,
  HomeIcon,
  BellAlertIcon,
  NewspaperIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { TextField, Avatar, Typography, Box } from "@mui/material";

const MySwal = withReactContent(Swal);

const navigation = [
  { name: "หน้าหลัก", href: "/", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "ข่าวสารกิจกรรม", href: "/news", icon: <NewspaperIcon className="h-5 w-5" /> },
  { name: "ลงทะเบียนกิจกรรม", href: "/register", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
];

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      <Disclosure as="nav" className="bg-gray-900/80 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-gray-800/50 font-sarabun">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
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

                <div className="hidden md:flex items-center space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={classNames(
                        pathname === item.href
                          ? "bg-orange-800/80 text-white"
                          : "text-gray-200 hover:bg-gray-700/50 hover:text-white",
                        "rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all duration-300"
                      )}
                      aria-label={`ไปที่${item.name}`}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  ))}
                </div>

                <div className="relative flex items-center space-x-4" ref={dropdownRef}>
                  <button
                    type="button"
                    className="relative rounded-full p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-label="ดูการแจ้งเตือน"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <BellAlertIcon className="h-6 w-6" aria-hidden="true" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
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
                      <Menu.Button className="flex rounded-full bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300">
                        <span className="sr-only">เปิดเมนูผู้ใช้</span>
                        <Image
                          className="rounded-full border border-gray-700"
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
                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-gray-900/80 backdrop-blur-lg shadow-lg border border-gray-800/50 focus:outline-none">
                          <div className="p-4">
                            <div className="text-sm text-center">
                              <p className="font-medium text-white">{session.user.name || "ผู้ใช้"}</p>
                              <p className="text-gray-400">{session.user.email || "ไม่ระบุอีเมล"}</p>
                            </div>
                          </div>
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleEditProfile}
                                  className={classNames(
                                    active ? "bg-gray-700/50 text-white" : "text-gray-200",
                                    "flex items-center gap-2 w-full px-4 py-2 text-sm"
                                  )}
                                >
                                  <PencilSquareIcon className="h-5 w-5" />
                                  แก้ไขโปรไฟล์
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => signOut()}
                                  className={classNames(
                                    active ? "bg-gray-700/50 text-white" : "text-gray-200",
                                    "flex items-center gap-2 w-full px-4 py-2 text-sm"
                                  )}
                                >
                                  <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
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
                      className="text-gray-200 hover:bg-blue-700/80 hover:text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300"
                      aria-label="เข้าสู่ระบบ"
                    >
                      เข้าสู่ระบบ
                    </button>
                  )}

                  <Disclosure.Button className="md:hidden rounded-lg p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="sr-only">เปิดเมนูหลัก</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800/50">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="button"
                    onClick={() => handleNavigation(item.href)}
                    className={classNames(
                      pathname === item.href
                        ? "bg-orange-900/80 text-white"
                        : "text-gray-200 hover:bg-gray-700/50 hover:text-white",
                      "flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                    )}
                    aria-label={`ไปที่${item.name}`}
                  >
                    {item.icon}
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
