
// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import { Disclosure, Menu, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { Bars3Icon } from "@heroicons/react/24/outline";
// import { HomeIcon, NewspaperIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
// import { BellAlertIcon } from "@heroicons/react/24/outline";
// import { Fragment, useState, useEffect } from "react";
// import Image from "next/image";

// const navigation = [
//   { name: "หน้าหลัก", href: "/", icon: <HomeIcon className="h-5 w-5" /> },
//   { name: "ข่าวสาร", href: "/news", icon: <NewspaperIcon className="h-5 w-5" /> },
//   { name: "กิจกรรม", href: "/register", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
// ];

// function classNames(...classes: any[]) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [notifications, setNotifications] = useState(0); // จำนวนแจ้งเตือน

//   useEffect(() => {
//     const fetchRegistrations = async () => {
//       if (!session || !session.user?.id) return;

//       try {
//         const response = await fetch(
//           `/api/users/registrations?userId=${session.user.id}`
//         );

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
//   ];

//   if (hideNavbarRoutes.includes(pathname)) {
//     return null;
//   }

//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//         </div>
//       )}

//       <Disclosure as="nav" className="bg-gray-900 shadow-md">
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
//                     style={{
//                       objectFit: "contain",
//                       filter: "contrast(1.2)",
//                     }}
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
//                           : "text-gray-300 hover:bg-gray-800 hover:text-white",
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
//                                   "block px-4 py-2 text-sm text-gray-300"
//                                 )}
//                               >
//                                 {session.user?.email || "email"}
//                               </div>
//                             )}
//                           </Menu.Item>
//                           <Menu.Item>
//                             {({ active }) => (
//                               <div
//                                 className={classNames(
//                                   active ? "bg-gray-700" : "",
//                                   "block px-4 py-2 text-sm text-gray-300"
//                                 )}
//                               >
//                                 {session.user?.name || "User"}
//                               </div>
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
//                                   "block w-full text-left px-4 py-2 text-sm text-gray-300"
//                                 )}
//                               >
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
//                   <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
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
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { HomeIcon, NewspaperIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";

const navigation = [
  { name: "หน้าหลัก", href: "/", icon: <HomeIcon className="h-5 w-5" /> },
  { name: "ข่าวสาร", href: "/news", icon: <NewspaperIcon className="h-5 w-5" /> },
  { name: "กิจกรรม", href: "/register", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(0); // จำนวนแจ้งเตือน

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!session || !session.user?.id) return;

      try {
        const response = await fetch(
          `/api/users/registrations?userId=${session.user.id}`
        );

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
  ];

  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

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
                      objectFit: "contain",
                      filter: "contrast(1.2)",
                    }}
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
                                  "block px-4 py-2 text-sm text-gray-300"
                                )}
                              >
                                {session.user?.email || "email"}
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active ? "bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-300"
                                )}
                              >
                                {session.user?.name || "User"}
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  signOut({ callbackUrl: "/login" })
                                }
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
          </>
        )}
      </Disclosure>
    </>
  );
}
