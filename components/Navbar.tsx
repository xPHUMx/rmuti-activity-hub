
// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { XMarkIcon, Bars3Icon, HomeIcon, BellAlertIcon, NewspaperIcon, ClipboardDocumentListIcon, PencilSquareIcon, UserIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
// import { Fragment, useState, useEffect } from "react";
// import Image from "next/image";
// import Swal from 'sweetalert2'; // SweetAlert2
// import withReactContent from 'sweetalert2-react-content'; // SweetAlert2
// import { Calendar1Icon } from "lucide-react";

// const MySwal = withReactContent(Swal);

// const navigation = [
//   { name: "หน้าหลัก", href: "/", icon: <HomeIcon className="h-5 w-5" /> },
//   { name: "ข่าวสารกิจกรรม", href: "/news", icon: <NewspaperIcon className="h-5 w-5" /> },
//   { name: "ลงทะเบียนกิจกรรม", href: "/register", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
//   { name: "ปฏิทิน", href: "calendar", icon: <Calendar1Icon className="h-5 w-5" /> },
// ];

// function classNames(...classes: any[]) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [notifications, setNotifications] = useState(0);

//   // Fetch registrations
//   useEffect(() => {
//     const fetchRegistrations = async () => {
//       if (!session?.user?.id) return;

//       try {
//         const response = await fetch(`/api/users/registrations?userId=${session.user.id}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch registrations");
//         }
//         const data = await response.json();
//         setNotifications(data.length);
//       } catch (error) {
//         console.error("Error fetching registrations:", error);
//       }
//     };

//     fetchRegistrations();
//   }, [session]);

//   const clearNotifications = () => {
//     setNotifications(0);
//   };

//   const handleNavigation = async (href: string) => {
//     setLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     router.push(href);
//     setLoading(false);
//   };

//   const hideNavbarRoutes = [
//     "/login",
//     "/admin/dashboard",
//     "/admin/activities",
//     "/admin/news",
//     "/admin/manager-user",
//     "/admin/users",
//     "/admin/calendar"
//   ];

//   if (hideNavbarRoutes.includes(pathname)) {
//     return null;
//   }

//   const handleEditProfile = async () => {
//     if (!session?.user?.id) {
//       Swal.fire("ไม่พบข้อมูลผู้ใช้", "กรุณาล็อกอินใหม่", "error");
//       return;
//     }

//     const res = await fetch(`/api/users/${session.user.id}`);
//     if (!res.ok) {
//       Swal.fire("ไม่สามารถดึงข้อมูลได้", `API ส่งข้อผิดพลาด: ${res.statusText}`, "error");
//       return;
//     }

//     try {
//       const user = await res.json();
//       if (!user) {
//         Swal.fire("ไม่พบข้อมูลผู้ใช้", "ไม่สามารถดึงข้อมูลได้", "error");
//         return;
//       }

//       MySwal.fire({
//         title: "แก้ไขโปรไฟล์",
//         html: `
//           <div style="display: flex; flex-direction: column; align-items: center;">
//             <img src="${user.image || '/img/default-profile.png'}" 
//                  alt="Profile Picture" 
//                  style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
//             <strong style="margin-bottom: 10px;">${user.email || 'ไม่ระบุ'}</strong>
//           </div>
//           <input id="swal-input1" class="swal2-input" placeholder="ชื่อ-นามสกุล" value="${user.name || ''}">
//           <input id="swal-input2" class="swal2-input" placeholder="รหัสนักศึกษา" value="${user.studentId || ''}">
//           <input id="swal-input3" class="swal2-input" placeholder="สาขา" value="${user.department || ''}">
//           <input id="swal-input4" class="swal2-input" placeholder="ปีการศึกษา" value="${user.year || ''}">
//           <input id="swal-input5" class="swal2-input" placeholder="เบอร์โทรศัพท์" value="${user.phone || ''}">
//         `,
//         focusConfirm: false,
//         showCancelButton: true,
//         confirmButtonText: "อัปเดตโปรไฟล์",
//         preConfirm: () => {
//           const fullName = (document.getElementById("swal-input1") as HTMLInputElement).value;
//           const studentId = (document.getElementById("swal-input2") as HTMLInputElement).value;
//           const department = (document.getElementById("swal-input3") as HTMLInputElement).value;
//           const year = (document.getElementById("swal-input4") as HTMLInputElement).value;
//           const phone = (document.getElementById("swal-input5") as HTMLInputElement).value;

//           return { fullName, studentId, department, year, phone };
//         }
//       }).then((result) => {
//         if (result.isConfirmed) {
//           const { fullName, studentId, department, year, phone } = result.value;

//           fetch("/api/users/update-profile", {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               email: session?.user?.email,
//               fullName,
//               studentId,
//               department,
//               year,
//               phone,
//             }),
//           })
//             .then((response) => {
//               if (response.ok) {
//                 Swal.fire("สำเร็จ!", "โปรไฟล์ของคุณได้ถูกอัปเดตแล้ว.", "success");
//               } else {
//                 Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปเดตโปรไฟล์ได้.", "error");
//               }
//             })
//             .catch((error) => {
//               Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถติดต่อ API ได้.", "error");
//             });
//         }
//       });
//     } catch (error) {
//       Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถแปลงข้อมูลจาก API ได้.", "error");
//     }
//   };

//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
//         </div>
//       )}

//       <Disclosure as="nav" className="bg-gray-800 shadow-lg sticky top-0 z-50">
//         {({ open }) => (
//           <>
//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//               <div className="flex h-16 items-center justify-between">
//                 {/* Logo */}
//                 <div className="flex items-center">
//                   <Image
//                     src="/img/logohaed1.png"
//                     alt="Your Company Logo"
//                     width={120}
//                     height={120}
//                     priority
//                     className="object-contain"
//                   />
//                 </div>

//                 {/* Desktop Navigation */}
//                 <div className="flex space-x-6 ml-4">
//                   {navigation.map((item) => (
//                     <button
//                       key={item.name}
//                       onClick={() => handleNavigation(item.href)}
//                       className={classNames(
//                         pathname === item.href
//                           ? "bg-orange-800 text-white"
//                           : "text-gray-300 hover:bg-gray-700 hover:text-white",
//                         "rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2"
//                       )}
//                     >
//                       {item.icon}
//                       {item.name}
//                     </button>
//                   ))}
//                 </div>

//                 {/* User Profile and Notifications */}
//                 <div className="flex items-center space-x-6">
//                   <button
//                     type="button"
//                     className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
//                     onClick={clearNotifications}
//                   >
//                     <span className="sr-only">View notifications</span>
//                     <BellAlertIcon className="h-6 w-6" aria-hidden="true" />
//                     {notifications > 0 && (
//                       <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
//                         {notifications}
//                       </span>
//                     )}
//                   </button>

//                   {session ? (

                    
// <Menu as="div" className="relative ml-3">
//   <div>
//     <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
//       <span className="sr-only">Open user menu</span>
//       <Image
//         className="rounded-full"
//         src={session.user.image || "/img/default-profile.png"}
//         alt="User Avatar"
//         width={32}
//         height={32}
//       />
//     </Menu.Button>
//   </div>
//   <Transition
//     as={Fragment}
//     enter="transition ease-out duration-100"
//     enterFrom="transform opacity-0 scale-95"
//     enterTo="transform opacity-100 scale-100"
//     leave="transition ease-in duration-75"
//     leaveFrom="transform opacity-100 scale-100"
//     leaveTo="transform opacity-0 scale-95"
//   >
//     <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//       <div className="py-2 px-4">
//         {/* ข้อมูลผู้ใช้งาน */}
//         <div className="text-sm">
//           <p className="font-medium text-gray-900">{session.user.name || "ผู้ใช้"}</p>
//           <p className="text-gray-500">{session.user.email || "ไม่ระบุอีเมล"}</p>
//         </div>
//       </div>

//       <div className="py-1">
//         {/* แก้ไขโปรไฟล์ */}
//         <Menu.Item>
//           {({ active }) => (
//             <button
//               onClick={handleEditProfile}
//               className={classNames(
//                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
//                 "flex items-center gap-2 block px-4 py-2 text-sm"
//               )}
//             >
//               <PencilSquareIcon className="h-5 w-5" />
//               แก้ไขโปรไฟล์
//             </button>
//           )}
//         </Menu.Item>

//         {/* ออกจากระบบ */}
//         <Menu.Item>
//           {({ active }) => (
//             <button
//               onClick={() => signOut()}
//               className={classNames(
//                 active ? "bg-gray-100 text-gray-900" : "text-gray-700",
//                 "flex items-center gap-2 block px-4 py-2 text-sm"
//               )}
//             >
//               <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
//               ออกจากระบบ
//             </button>
//           )}
//         </Menu.Item>
//       </div>
//     </Menu.Items>
//   </Transition>
// </Menu>

//                   ) : (
//                     <button
//                       onClick={() => router.push("/login")}
//                       className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-4 py-2"
//                     >
//                       เข้าสู่ระบบ
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </Disclosure>
//     </>
//   );
// }

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon, Bars3Icon, HomeIcon, BellAlertIcon, NewspaperIcon, ClipboardDocumentListIcon, PencilSquareIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Calendar1Icon } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const navigation = [
  { name: "หน้าหลัก", href: "/", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "ข่าวสารกิจกรรม", href: "/news", icon: <NewspaperIcon className="h-5 w-5" /> },
  { name: "ลงทะเบียนกิจกรรม", href: "/register", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
  { name: "ปฏิทิน", href: "/calendar", icon: <Calendar1Icon className="h-5 w-5" /> },
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

  // ดึงข้อมูลการลงทะเบียน
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/users/registrations?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลการลงทะเบียนได้");
        }
        const data = await response.json();
        setNotifications(data.length);
      } catch (error) {
        console.error("ข้อผิดพลาดในการดึงข้อมูลการลงทะเบียน:", error);
        MySwal.fire("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลการแจ้งเตือนได้", "error");
      }
    };

    fetchRegistrations();
  }, [session]);

  const clearNotifications = () => {
    setNotifications(0);
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

    const res = await fetch(`/api/users/${session.user.id}`);
    if (!res.ok) {
      MySwal.fire("ไม่สามารถดึงข้อมูลได้", `API ส่งข้อผิดพลาด: ${res.statusText}`, "error");
      return;
    }

    try {
      const user = await res.json();
      if (!user) {
        MySwal.fire("ไม่พบข้อมูลผู้ใช้", "ไม่สามารถดึงข้อมูลได้", "error");
        return;
      }

      MySwal.fire({
        title: "แก้ไขโปรไฟล์",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <img src="${user.image || '/img/default-profile.png'}" 
                 alt="ภาพโปรไฟล์" 
                 style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
            <strong style="margin-bottom: 10px;">${user.email || 'ไม่ระบุ'}</strong>
          </div>
          <input id="swal-input1" class="swal2-input" placeholder="ชื่อ-นามสกุล" value="${user.name || ''}">
          <input id="swal-input2" class="swal2-input" placeholder="รหัสนักศึกษา" value="${user.studentId || ''}">
          <input id="swal-input3" class="swal2-input" placeholder="สาขา" value="${user.department || ''}">
          <input id="swal-input4" class="swal2-input" placeholder="ปีการศึกษา" value="${user.year || ''}">
          <input id="swal-input5" class="swal2-input" placeholder="เบอร์โทรศัพท์" value="${user.phone || ''}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "อัปเดตโปรไฟล์",
        cancelButtonText: "ยกเลิก",
        preConfirm: () => {
          const fullName = (document.getElementById("swal-input1") as HTMLInputElement).value;
          const studentId = (document.getElementById("swal-input2") as HTMLInputElement).value;
          const department = (document.getElementById("swal-input3") as HTMLInputElement).value;
          const year = (document.getElementById("swal-input4") as HTMLInputElement).value;
          const phone = (document.getElementById("swal-input5") as HTMLInputElement).value;

          return { fullName, studentId, department, year, phone };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { fullName, studentId, department, year, phone } = result.value;

          fetch("/api/users/update-profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session?.user?.email,
              fullName,
              studentId,
              department,
              year,
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
            .catch((error) => {
              MySwal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถติดต่อ API ได้", "error");
            });
        }
      });
    } catch (error) {
      MySwal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถแปลงข้อมูลจาก API ได้", "error");
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
                {/* โลโก้ */}
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

                {/* เมนูเดสก์ท็อป */}
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

                {/* โปรไฟล์และการแจ้งเตือน */}
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="relative rounded-full p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                    onClick={clearNotifications}
                    aria-label="ดูการแจ้งเตือน"
                  >
                    <BellAlertIcon className="h-6 w-6" aria-hidden="true" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                        {notifications}
                      </span>
                    )}
                  </button>

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

                  {/* ปุ่ม Hamburger สำหรับมือถือ */}
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

            {/* เมนูมือถือ */}
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 bg-gray-900/80 backdrop-blur-lg border-t border-gray-800/50">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="button"
                    onClick={() => handleNavigation(item.href)}
                    className={classNames(
                      pathname === item.href
                        ? "bg-blue-700/80 text-white"
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
