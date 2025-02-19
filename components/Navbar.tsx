
// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { XMarkIcon, Bars3Icon, HomeIcon, NewspaperIcon, ClipboardDocumentListIcon, BellAlertIcon, PencilSquareIcon, FolderIcon, UserIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
// import { Fragment, useState, useEffect } from "react";
// import Image from "next/image";
// import Swal from 'sweetalert2'; // SweetAlert2
// import withReactContent from 'sweetalert2-react-content'; // ใช้ SweetAlert2

// const MySwal = withReactContent(Swal); // ใช้ SweetAlert2

// const navigation = [
//   { name: "หน้าหลัก", href: "/", icon: <HomeIcon className="h-5 w-5" /> },
//   { name: "ข่าวสาร", href: "/news", icon: <NewspaperIcon className="h-5 w-5" /> },
//   { name: "กิจกรรม", href: "/register", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
//   { name: "ปฏิทิน", href: "/"},
// ];

// function classNames(...classes: any[]) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [notifications, setNotifications] = useState(0); // จำนวนแจ้งเตือน

//   // ดึงข้อมูลการลงทะเบียนของผู้ใช้
//   useEffect(() => {
//     const fetchRegistrations = async () => {
//       if (!session?.user?.id) return;

//       try {
//         const response = await fetch(`/api/users/registrations?userId=${session.user.id}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch registrations");
//         }
//         const data = await response.json();
//         setNotifications(data.length); // กำหนดจำนวนกิจกรรม
//       } catch (error) {
//         console.error("Error fetching registrations:", error);
//       }
//     };

//     fetchRegistrations();
//   }, [session]);

//   const clearNotifications = () => {
//     setNotifications(0); // ล้างการแจ้งเตือนเมื่อคลิก
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
//     "/admin/users"

//   ];

//   if (hideNavbarRoutes.includes(pathname)) {
//     return null;
//   }

//   const handleEditProfile = async () => {
//     if (!session?.user?.id) {
//       Swal.fire('ไม่พบข้อมูลผู้ใช้', 'กรุณาล็อกอินใหม่', 'error');
//       return;
//     }
  
//     // ดึงข้อมูลจาก API ก่อนเปิด SweetAlert2
//     const res = await fetch(`/api/users/${session.user.id}`); // ใช้ GET method
  
//     // ตรวจสอบสถานะการตอบกลับ API
//     if (!res.ok) {
//       Swal.fire('ไม่สามารถดึงข้อมูลได้', `API ส่งข้อผิดพลาด: ${res.statusText}`, 'error');
//       console.error('API Error:', res.statusText); // แสดงข้อความผิดพลาดในคอนโซล
//       return;
//     }
  
//     try {
//       const user = await res.json(); // พยายามแปลงข้อมูลเป็น JSON
//       if (!user) {
//         Swal.fire('ไม่พบข้อมูลผู้ใช้', 'ไม่สามารถดึงข้อมูลได้', 'error');
//         return;
//       }
  
//       // เปิด SweetAlert2 พร้อมข้อมูล
//       MySwal.fire({
//         title: 'แก้ไขโปรไฟล์',
//         html: `
//           <input id="swal-input1" class="swal2-input" placeholder="ชื่อ-นามสกุล" value="${user.name || ''}">
//           <input id="swal-input2" class="swal2-input" placeholder="รหัสนักศึกษา" value="${user.studentId || ''}">
//           <input id="swal-input3" class="swal2-input" placeholder="สาขา" value="${user.department || ''}">
//           <input id="swal-input4" class="swal2-input" placeholder="ปีการศึกษา" value="${user.year || ''}">
//           <input id="swal-input5" class="swal2-input" placeholder="เบอร์โทรศัพท์" value="${user.phone || ''}">
//         `,
//         focusConfirm: false,
//         showCancelButton: true,
//         confirmButtonText: "บันทึก",
//         preConfirm: () => {
//           const fullName = (document.getElementById('swal-input1') as HTMLInputElement).value;
//           const studentId = (document.getElementById('swal-input2') as HTMLInputElement).value;
//           const department = (document.getElementById('swal-input3') as HTMLInputElement).value;
//           const year = (document.getElementById('swal-input4') as HTMLInputElement).value;
//           const phone = (document.getElementById('swal-input5') as HTMLInputElement).value;
      
//           return { fullName, studentId, department, year, phone };
//         }
//       }).then((result) => {
//         if (result.isConfirmed) {
//           const { fullName, studentId, department, year, phone } = result.value;
  
//           // ส่งข้อมูลที่อัปเดตไปยัง API
//           fetch('/api/users/update-profile', {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               email: session?.user?.email,
//               fullName,
//               studentId,
//               department,
//               year,
//               phone,
//             }),
//           })
//           .then(response => {
//             if (response.ok) {
//               Swal.fire('สำเร็จ!', 'โปรไฟล์ของคุณได้ถูกอัปเดตแล้ว.', 'success');
//             } else {
//               Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถอัปเดตโปรไฟล์ได้.', 'error');
//             }
//           })
//           .catch(error => {
//             Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถติดต่อ API ได้.', 'error');
//             console.error('Error updating profile:', error); // แสดงข้อผิดพลาดในคอนโซล
//           });
//         }
//       });
//     } catch (error) {
//       Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถแปลงข้อมูลจาก API ได้.', 'error');
//       console.error('JSON Parse Error:', error); // แสดงข้อผิดพลาดการแปลง JSON
//     }
//   };
  
//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//         </div>
//       )}

//       <Disclosure as="nav" className="bg-gray-800 shadow-md">
//         {({ open }) => (
//           <>
//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//               <div className="flex h-16 items-center justify-between">
//                 {/* Logo */}
//                 <div className="flex items-center">
//                   <Image
//                     src="/img/logohaed1.png"
//                     alt="Your Company Logo"
//                     width={80}
//                     height={80}
//                     priority
//                     className="object-contain"
//                   />
//                 </div>

//                 {/* Desktop Navigation */}
//                 <div className="hidden sm:flex space-x-4">
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

//                 {/* User Profile Dropdown */}
//                 <div className="flex items-center space-x-4">
//                   <button
//                     type="button"
//                     className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
//                     onClick={clearNotifications}
//                   >
//                     <span className="sr-only">View notifications</span>
//                     <BellAlertIcon className="h-6 w-6" aria-hidden="true" />
//                     {notifications > 0 && (
//                       <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
//                         {notifications}
//                       </span>
//                     )}
//                   </button>

//                   {session && (
//                     <Menu as="div" className="relative">
//                       <Menu.Button className="flex items-center rounded-full">
//                         <span className="sr-only">Open user menu</span>
//                         <Image
//                           src={session.user?.image || "/img/default-profile.png"}
//                           alt="User profile"
//                           width={32}
//                           height={32}
//                           className="h-8 w-8 rounded-full"
//                         />
//                       </Menu.Button>
//                       <Transition
//                         as={Fragment}
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                       >
//                         <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                           <Menu.Item>
//                             {({ active }) => (
//                               <div
//                                 className={classNames(
//                                   active ? "bg-gray-700" : "",
//                                   "block px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
//                                 )}
//                               >
//                                 <FolderIcon className="h-5 w-5 inline mr-2" /> {/* ไอคอน Email */}
//                                 {session.user?.email || "email"}
//                               </div>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <div
//                                 className={classNames(
//                                   active ? "bg-gray-700" : "",
//                                   "block px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
//                                 )}
//                               >
//                                 <UserIcon className="h-5 w-5 inline mr-2" /> {/* ไอคอน User */}
//                                 {session.user?.name || "User"}
//                               </div>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <button
//                                 onClick={handleEditProfile} // เพิ่มปุ่มแก้ไขโปรไฟล์
//                                 className={classNames(
//                                   active ? "bg-gray-700" : "",
//                                   "block w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
//                                 )}
//                               >
//                                 <PencilSquareIcon className="h-5 w-5 inline mr-2" /> แก้ไขโปรไฟล์
//                               </button>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <button
//                                 onClick={() =>
//                                   signOut({ callbackUrl: "/login" })
//                                 }
//                                 className={classNames(
//                                   active ? "bg-gray-700" : "",
//                                   "block w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
//                                 )}
//                               >
//                                 <ArrowLeftStartOnRectangleIcon className="h-5 w-5 inline mr-2" /> {/* ไอคอนออกจากระบบ */}
//                                 ออกจากระบบ
//                               </button>
//                             )}
//                           </Menu.Item>
//                         </Menu.Items>
//                       </Transition>
//                     </Menu>
//                   )}
//                 </div>

//                 {/* Mobile menu button */}
//                 <div className="sm:hidden">
//                   <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
//                     <span className="sr-only">Open main menu</span>
//                     {open ? (
//                       <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                     ) : (
//                       <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                     )}
//                   </Disclosure.Button>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Menu */}
//             <Disclosure.Panel className="sm:hidden bg-gray-800">
//               <div className="space-y-1 px-2 pb-3 pt-2">
//                 {navigation.map((item) => (
//                   <button
//                     key={item.name}
//                     onClick={() => handleNavigation(item.href)}
//                     className={classNames(
//                       pathname === item.href
//                         ? "bg-orange-900 text-white"
//                         : "text-gray-300 hover:bg-gray-700 hover:text-white",
//                       "block rounded-md px-3 py-2 text-base font-medium flex items-center gap-2"
//                     )}
//                   >
//                     {item.icon}
//                     {item.name}
//                   </button>
//                 ))}
//               </div>
//             </Disclosure.Panel>
//           </>
//         )}
//       </Disclosure>
//     </>
//   );
// }



// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { XMarkIcon, Bars3Icon, HomeIcon, BellAlertIcon , NewspaperIcon, FolderIcon, ClipboardDocumentListIcon, PencilSquareIcon, UserIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
// import { Fragment, useState, useEffect } from "react";
// import Image from "next/image";
// import Swal from 'sweetalert2'; // SweetAlert2
// import withReactContent from 'sweetalert2-react-content'; // ใช้ SweetAlert2
// import { Calendar1Icon } from "lucide-react";

// const MySwal = withReactContent(Swal); // ใช้ SweetAlert2

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
//   const [notifications, setNotifications] = useState(0); // จำนวนแจ้งเตือน
  

//   // ดึงข้อมูลการลงทะเบียนของผู้ใช้
//   useEffect(() => {
//     const fetchRegistrations = async () => {
//       if (!session?.user?.id) return;

//       try {
//         const response = await fetch(`/api/users/registrations?userId=${session.user.id}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch registrations");
//         }
//         const data = await response.json();
//         setNotifications(data.length); // กำหนดจำนวนกิจกรรม
//       } catch (error) {
//         console.error("Error fetching registrations:", error);
//       }
//     };

//     fetchRegistrations();
//   }, [session]);

//   const clearNotifications = () => {
//     setNotifications(0); // ล้างการแจ้งเตือนเมื่อคลิก
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
//       Swal.fire('ไม่พบข้อมูลผู้ใช้', 'กรุณาล็อกอินใหม่', 'error');
//       return;
//     }
  
//     // ดึงข้อมูลจาก API ก่อนเปิด SweetAlert2
//     const res = await fetch(`/api/users/${session.user.id}`); // ใช้ GET method
  
//     // ตรวจสอบสถานะการตอบกลับ API
//     if (!res.ok) {
//       Swal.fire('ไม่สามารถดึงข้อมูลได้', `API ส่งข้อผิดพลาด: ${res.statusText}`, 'error');
//       console.error('API Error:', res.statusText); // แสดงข้อความผิดพลาดในคอนโซล
//       return;
//     }
  
//     try {
//       const user = await res.json(); // พยายามแปลงข้อมูลเป็น JSON
//       if (!user) {
//         Swal.fire('ไม่พบข้อมูลผู้ใช้', 'ไม่สามารถดึงข้อมูลได้', 'error');
//         return;
//       }
  
//       // เปิด SweetAlert2 พร้อมข้อมูล
//       MySwal.fire({
//         title: 'แก้ไขโปรไฟล์',
//         html: `
//           <input id="swal-input1" class="swal2-input" placeholder="ชื่อ-นามสกุล" value="${user.name || ''}">
//           <input id="swal-input2" class="swal2-input" placeholder="รหัสนักศึกษา" value="${user.studentId || ''}">
//           <input id="swal-input3" class="swal2-input" placeholder="สาขา" value="${user.department || ''}">
//           <input id="swal-input4" class="swal2-input" placeholder="ปีการศึกษา" value="${user.year || ''}">
//           <input id="swal-input5" class="swal2-input" placeholder="เบอร์โทรศัพท์" value="${user.phone || ''}">
//         `,
//         focusConfirm: false,
//         showCancelButton: true,
//         confirmButtonText: "บันทึก",
//         preConfirm: () => {
//           const fullName = (document.getElementById('swal-input1') as HTMLInputElement).value;
//           const studentId = (document.getElementById('swal-input2') as HTMLInputElement).value;
//           const department = (document.getElementById('swal-input3') as HTMLInputElement).value;
//           const year = (document.getElementById('swal-input4') as HTMLInputElement).value;
//           const phone = (document.getElementById('swal-input5') as HTMLInputElement).value;
      
//           return { fullName, studentId, department, year, phone };
//         }
//       }).then((result) => {
//         if (result.isConfirmed) {
//           const { fullName, studentId, department, year, phone } = result.value;
  
//           // ส่งข้อมูลที่อัปเดตไปยัง API
//           fetch('/api/users/update-profile', {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               email: session?.user?.email,
//               fullName,
//               studentId,
//               department,
//               year,
//               phone,
//             }),
//           })
//           .then(response => {
//             if (response.ok) {
//               Swal.fire('สำเร็จ!', 'โปรไฟล์ของคุณได้ถูกอัปเดตแล้ว.', 'success');
//             } else {
//               Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถอัปเดตโปรไฟล์ได้.', 'error');
//             }
//           })
//           .catch(error => {
//             Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถติดต่อ API ได้.', 'error');
//             console.error('Error updating profile:', error); // แสดงข้อผิดพลาดในคอนโซล
//           });
//         }
//       });
//     } catch (error) {
//       Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถแปลงข้อมูลจาก API ได้.', 'error');
//       console.error('JSON Parse Error:', error); // แสดงข้อผิดพลาดการแปลง JSON
//     }
//   };

//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
//         </div>
//       )}

//       <Disclosure as="nav" className="bg-gray-800 shadow-md sticky top-0 z-50">
//         {({ open }) => (
//           <>
//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//               <div className="flex h-16 items-center justify-between">
//                 {/* Logo */}
//                 <div className="flex items-center">
//                   <Image
//                     src="/img/logohaed1.png"
//                     alt="Your Company Logo"
//                     width={80}
//                     height={80}
//                     priority
//                     className="object-contain"
//                   />
//                 </div>

//                 {/* Desktop Navigation */}
//                 <div className="hidden sm:flex space-x-4">
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

//                 {/* User Profile Dropdown */}
//                 <div className="flex items-center space-x-4">
//                   <button
//                     type="button"
//                     className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
//                     onClick={clearNotifications}
//                   >
//                     <span className="sr-only">View notifications</span>
//                     <BellAlertIcon className="h-6 w-6" aria-hidden="true" />
//                     {notifications > 0 && (
//                       <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
//                         {notifications}
//                       </span>
//                     )}
//                   </button>

//                   {session && (
//                     <Menu as="div" className="relative">
//                       <Menu.Button className="flex items-center rounded-full">
//                         <span className="sr-only">Open user menu</span>
//                         <Image
//                           src={session.user?.image || "/img/default-profile.png"}
//                           alt="User profile"
//                           width={32}
//                           height={32}
//                           className="h-8 w-8 rounded-full"
//                         />
//                       </Menu.Button>
//                       <Transition
//                         as={Fragment}
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                       >
//                         <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                           <Menu.Item>
//                             {({ active }) => (
//                               <div
//                                 className={classNames(
//                                   active ? "bg-gray-700" : "",
//                                   "block px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
//                                 )}
//                               >
//                                 <FolderIcon className="h-5 w-5 inline mr-2" /> {/* ไอคอน Email */}
//                                 {session.user?.email || "email"}
//                               </div>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <div
//                                 className={classNames(
//                                   active ? "bg-gray-700" : "",
//                                   "block px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
//                                 )}
//                               >
//                                 <UserIcon className="h-5 w-5 inline mr-2" /> {/* ไอคอน User */}
//                                 {session.user?.name || "User"}
//                               </div>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <button
//                                 onClick={handleEditProfile} // เพิ่มปุ่มแก้ไขโปรไฟล์
//                                 className={classNames(
//                                   active ? "bg-gray-700" : "",
//                                   "block w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
//                                 )}
//                               >
//                                 <PencilSquareIcon className="h-5 w-5 inline mr-2" /> แก้ไขโปรไฟล์
//                               </button>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <button
//   onClick={async () => {
//     if (session?.user?.email) {
//       try {
//         console.log("🚀 Removing user from onlineUsers:", session.user.email);

//         const response = await fetch("/api/online-users", {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: session.user.email }),
//         });

//         const result = await response.json();
//         console.log("✅ User removed from onlineUsers:", result);

//         if (!response.ok) {
//           console.error("❌ Failed to remove online user:", result.error);
//         }
//       } catch (error) {
//         console.error("❌ Error removing online user:", error);
//       }
//     }

//     // ✅ หลังจากลบ user ออกจาก onlineUsers ให้ signOut
//     signOut({ callbackUrl: "/login" });
//   }}
//   className={classNames(
//     active ? "bg-gray-700" : "",
//     "block w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
//   )}
// >
//   <ArrowLeftStartOnRectangleIcon className="h-5 w-5 inline mr-2" /> ออกจากระบบ
// </button>
//                             )}
//                           </Menu.Item>
//                         </Menu.Items>
//                       </Transition>
//                     </Menu>
//                   )}
//                 </div>

//                 {/* Mobile menu button */}
//                 <div className="sm:hidden">
//                   <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
//                     <span className="sr-only">Open main menu</span>
//                     {open ? (
//                       <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                     ) : (
//                       <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                     )}
//                   </Disclosure.Button>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Menu */}
//             <Disclosure.Panel className="sm:hidden bg-gray-800">
//               <div className="space-y-1 px-2 pb-3 pt-2">
//                 {navigation.map((item) => (
//                   <button
//                     key={item.name}
//                     onClick={() => handleNavigation(item.href)}
//                     className={classNames(
//                       pathname === item.href
//                         ? "bg-orange-900 text-white"
//                         : "text-gray-300 hover:bg-gray-700 hover:text-white",
//                       "block rounded-md px-3 py-2 text-base font-medium flex items-center gap-2"
//                     )}
//                   >
//                     {item.icon}
//                     {item.name}
//                   </button>
//                 ))}
//               </div>
//             </Disclosure.Panel>
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
import { XMarkIcon, Bars3Icon, HomeIcon, BellAlertIcon , NewspaperIcon, FolderIcon, ClipboardDocumentListIcon, PencilSquareIcon, UserIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import Swal from 'sweetalert2'; // SweetAlert2
import withReactContent from 'sweetalert2-react-content'; // ใช้ SweetAlert2
import { Calendar1Icon } from "lucide-react";

const MySwal = withReactContent(Swal); // ใช้ SweetAlert2

const navigation = [
  { name: "หน้าหลัก", href: "/", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "ข่าวสารกิจกรรม", href: "/news", icon: <NewspaperIcon className="h-5 w-5" /> },
  { name: "ลงทะเบียนกิจกรรม", href: "/register", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
  { name: "ปฏิทิน", href: "calendar", icon: <Calendar1Icon className="h-5 w-5" /> },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(0); // จำนวนแจ้งเตือน
  

  // ดึงข้อมูลการลงทะเบียนของผู้ใช้
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/users/registrations?userId=${session.user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch registrations");
        }
        const data = await response.json();
        setNotifications(data.length); // กำหนดจำนวนกิจกรรม
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    };

    fetchRegistrations();
  }, [session]);

  const clearNotifications = () => {
    setNotifications(0); // ล้างการแจ้งเตือนเมื่อคลิก
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
    "/admin/calendar"
  ];

  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  const handleEditProfile = async () => {
    if (!session?.user?.id) {
      Swal.fire("ไม่พบข้อมูลผู้ใช้", "กรุณาล็อกอินใหม่", "error");
      return;
    }
  
    // ดึงข้อมูลผู้ใช้จาก API
    const res = await fetch(`/api/users/${session.user.id}`);
    if (!res.ok) {
      Swal.fire("ไม่สามารถดึงข้อมูลได้", `API ส่งข้อผิดพลาด: ${res.statusText}`, "error");
      return;
    }
  
    try {
      const user = await res.json();
      if (!user) {
        Swal.fire("ไม่พบข้อมูลผู้ใช้", "ไม่สามารถดึงข้อมูลได้", "error");
        return;
      }
  
      // เปิด SweetAlert2 แบบฟอร์มแก้ไขโปรไฟล์
      MySwal.fire({
        title: "แก้ไขโปรไฟล์",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <!-- รูปโปรไฟล์ (แสดงอย่างเดียว) -->
            <img src="${user.image || '/img/default-profile.png'}" 
                 alt="Profile Picture" 
                 style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
  
            <!-- อีเมล (แสดงใต้รูปภาพ และเป็นตัวหนา) -->
            <strong style="margin-bottom: 10px;">${user.email || 'ไม่ระบุ'}</strong>
          </div>
  
          <!-- Input Fields -->
          <input id="swal-input1" class="swal2-input" placeholder="ชื่อ-นามสกุล" value="${user.name || ''}">
          <input id="swal-input2" class="swal2-input" placeholder="รหัสนักศึกษา" value="${user.studentId || ''}">
          <input id="swal-input3" class="swal2-input" placeholder="สาขา" value="${user.department || ''}">
          <input id="swal-input4" class="swal2-input" placeholder="ปีการศึกษา" value="${user.year || ''}">
          <input id="swal-input5" class="swal2-input" placeholder="เบอร์โทรศัพท์" value="${user.phone || ''}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "อัปเดตโปรไฟล์",
        preConfirm: () => {
          const fullName = (document.getElementById("swal-input1") as HTMLInputElement).value;
          const studentId = (document.getElementById("swal-input2") as HTMLInputElement).value;
          const department = (document.getElementById("swal-input3") as HTMLInputElement).value;
          const year = (document.getElementById("swal-input4") as HTMLInputElement).value;
          const phone = (document.getElementById("swal-input5") as HTMLInputElement).value;
  
          return { fullName, studentId, department, year, phone };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const { fullName, studentId, department, year, phone } = result.value;
  
          // ส่งข้อมูลไปอัปเดตโปรไฟล์
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
                Swal.fire("สำเร็จ!", "โปรไฟล์ของคุณได้ถูกอัปเดตแล้ว.", "success");
              } else {
                Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปเดตโปรไฟล์ได้.", "error");
              }
            })
            .catch((error) => {
              Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถติดต่อ API ได้.", "error");
            });
        }
      });
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถแปลงข้อมูลจาก API ได้.", "error");
    }
  };
  

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        </div>
      )}

      <Disclosure as="nav" className="bg-gray-800 shadow-md sticky top-0 z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                  <Image
                    src="/img/logohaed1.png"
                    alt="Your Company Logo"
                    width={80}
                    height={80}
                    priority
                    className="object-contain"
                  />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden sm:flex space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={classNames(
                        pathname === item.href
                          ? "bg-orange-800 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2"
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  ))}
                </div>

                {/* User Profile Dropdown */}
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                    onClick={clearNotifications}
                  >
                    <span className="sr-only">View notifications</span>
                    <BellAlertIcon className="h-6 w-6" aria-hidden="true" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                        {notifications}
                      </span>
                    )}
                  </button>

                  {session && (
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center rounded-full">
                        <span className="sr-only">Open user menu</span>
                        <Image
                          src={session.user?.image || "/img/default-profile.png"}
                          alt="User profile"
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active ? "bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
                                )}
                              >
                                <FolderIcon className="h-5 w-5 inline mr-2" /> {/* ไอคอน Email */}
                                {session.user?.email || "email"}
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active ? "bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
                                )}
                              >
                                <UserIcon className="h-5 w-5 inline mr-2" /> {/* ไอคอน User */}
                                {session.user?.name || "User"}
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleEditProfile} // เพิ่มปุ่มแก้ไขโปรไฟล์
                                className={classNames(
                                  active ? "bg-gray-700" : "",
                                  "block w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
                                )}
                              >
                                <PencilSquareIcon className="h-5 w-5 inline mr-2" /> แก้ไขโปรไฟล์
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
  onClick={async () => {
    if (session?.user?.email) {
      try {
        console.log("🚀 Removing user from onlineUsers:", session.user.email);

        const response = await fetch("/api/online-users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.email }),
        });

        const result = await response.json();
        console.log("✅ User removed from onlineUsers:", result);

        if (!response.ok) {
          console.error("❌ Failed to remove online user:", result.error);
        }
      } catch (error) {
        console.error("❌ Error removing online user:", error);
      }
    }

    // ✅ หลังจากลบ user ออกจาก onlineUsers ให้ signOut
    signOut({ callbackUrl: "/login" });
  }}
  className={classNames(
    active ? "bg-gray-700" : "",
    "block w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2"
  )}
>
  <ArrowLeftStartOnRectangleIcon className="h-5 w-5 inline mr-2" /> ออกจากระบบ
</button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <Disclosure.Panel className="sm:hidden bg-gray-800">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={classNames(
                      pathname === item.href
                        ? "bg-orange-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium flex items-center gap-2"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
