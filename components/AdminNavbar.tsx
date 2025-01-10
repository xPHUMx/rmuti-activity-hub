
// "use client";

// import { usePathname } from "next/navigation";
// import { signOut } from "next-auth/react";
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import { Fragment } from "react";
// import Image from "next/image";

// const navigation = [
//   { name: "แก้ไขหน้าหลัก", href: "/admin/dashboard" },
//   { name: "แก้ไขข่าวสาร", href: "/admin/news" },
//   { name: "แก้ไขกิจกรรม", href: "/admin/activities" },
// ];

// function classNames(...classes: any[]) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function AdminNavbar() {
//   const pathname = usePathname();

//   // Navbar visibility logic
//   const hideNavbarRoutes = ["/admin/login"];
//   if (hideNavbarRoutes.includes(pathname)) {
//     return null;
//   }

//   return (
//     <Disclosure as="nav" className="bg-gray-800 shadow-md">
//       {({ open }) => (
//         <>
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 items-center justify-between">
//               {/* Logo */}
//               <div className="flex items-center">
//                  <Image
//                    src="/img/logohaed1.png"
//                    alt="Your Company Logo"
//                    width={80}
//                    height={80}
//                    priority
//                    style={{
//                     objectFit: "contain", // ปรับการแสดงผลของภาพ
//                     filter: "contrast(1.2)", // เพิ่มความคมชัด (ถ้าจำเป็น)
//                   }}
//                 />
//               </div>

//               {/* Desktop Navigation */}
//               <div className="hidden sm:flex space-x-4">
//                 {navigation.map((item) => (
//                   <a
//                     key={item.name}
//                     href={item.href}
//                     className={classNames(
//                       pathname === item.href
//                         ? "bg-orange-800 text-white"
//                         : "text-gray-300 hover:bg-gray-800 hover:text-white",
//                       "rounded-md px-4 py-2 text-sm font-medium"
//                     )}
//                   >
//                     {item.name}
//                   </a>
//                 ))}
//               </div>

//               {/* Admin Profile Dropdown */}
//               <div className="flex items-center space-x-4">
//                 <Menu as="div" className="relative">
//                   <Menu.Button className="flex items-center rounded-full">
//                     <span className="sr-only">Open admin menu</span>
//                     <Image
//                       src="/img/admin-profile.png"
//                       alt="Admin profile"
//                       width={32}
//                       height={32}
//                       className="h-8 w-8 rounded-full"
//                     />
//                   </Menu.Button>
//                   <Transition
//                     as={Fragment}
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                   >
//                     <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                       <Menu.Item>
//                         {({ active }) => (
//                           <button
//                             onClick={() => signOut({ callbackUrl: "/login" })}
//                             className={classNames(
//                               active ? "bg-gray-700" : "",
//                               "block w-full text-left px-4 py-2 text-sm text-gray-300"
//                             )}
//                           >
//                             ออกจากระบบ
//                           </button>
//                         )}
//                       </Menu.Item>
//                     </Menu.Items>
//                   </Transition>
//                 </Menu>
//               </div>

//               {/* Mobile menu button */}
//               <div className="sm:hidden">
//                 <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
//                   <span className="sr-only">Open main menu</span>
//                   {open ? (
//                     <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                   ) : (
//                     <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                   )}
//                 </Disclosure.Button>
//               </div>
//             </div>
//           </div>

//           {/* Mobile Navigation */}
//           <Disclosure.Panel className="sm:hidden">
//             <div className="space-y-1 px-2 pb-3 pt-2">
//               {navigation.map((item) => (
//                 <a
//                   key={item.name}
//                   href={item.href}
//                   className={classNames(
//                     pathname === item.href
//                       ? "bg-gray-700 text-white"
//                       : "text-gray-300 hover:bg-gray-800 hover:text-white",
//                     "block rounded-md px-3 py-2 text-base font-medium"
//                   )}
//                 >
//                   {item.name}
//                 </a>
//               ))}
//             </div>
//           </Disclosure.Panel>
//         </>
//       )}
//     </Disclosure>
//   );
// }

"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import Image from "next/image";
import { FaUserCircle, FaEdit, FaNewspaper, FaCalendarAlt } from "react-icons/fa";

const navigation = [
  { name: "แก้ไขหน้าหลัก", href: "/admin/dashboard", icon: FaEdit },
  { name: "แก้ไขข่าวสาร", href: "/admin/news", icon: FaNewspaper },
  { name: "แก้ไขกิจกรรม", href: "/admin/activities", icon: FaCalendarAlt },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminNavbar() {
  const pathname = usePathname();

  // Navbar visibility logic
  const hideNavbarRoutes = ["/admin/login"];
  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 shadow-md">
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
                   style={{
                    objectFit: "contain", // ปรับการแสดงผลของภาพ
                    filter: "contrast(1.2)", // เพิ่มความคมชัด (ถ้าจำเป็น)
                  }}
                />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? "bg-orange-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white",
                      "rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Admin Profile Dropdown */}
              <div className="flex items-center space-x-4">
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center rounded-full">
                    <span className="sr-only">Open admin menu</span>
                    <FaUserCircle className="h-8 w-8 text-gray-300" />
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
                          <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className={classNames(
                              active ? "bg-gray-700" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-300"
                            )}
                          >
                            ออกจากระบบ
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
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

          {/* Mobile Navigation */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium flex items-center gap-2"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
