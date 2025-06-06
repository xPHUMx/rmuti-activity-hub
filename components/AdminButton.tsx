// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { FaUserShield } from "react-icons/fa";

// export default function AdminButton() {
//   const router = useRouter();
//   const [isAdminView, setIsAdminView] = useState(false);

//   const handleClick = () => {
//     const target = isAdminView ? "/" : "/admin/dashboard";
//     router.push(target);
//     setIsAdminView(!isAdminView);
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="fixed bottom-6 left-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
//       title="สลับมุมมองแอดมิน"
//     >
//       <FaUserShield className="text-xl" />
//     </button>
//   );
// }

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaUserShield } from "react-icons/fa";

export default function AdminButton() {
  const router = useRouter();
  const [isAdminView, setIsAdminView] = useState(false);
  const { data: session, status } = useSession();

  const handleClick = () => {
    const target = isAdminView ? "/" : "/admin/dashboard";
    router.push(target);
    setIsAdminView(!isAdminView);
  };

  // ถ้ายังโหลด session อยู่ ก็ยังไม่ render อะไร
  if (status === "loading") return null;

  // ถ้าไม่มี session หรือไม่ใช่ admin ก็ไม่แสดงปุ่ม
  if (!session || session.user.role !== "admin") return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition duration-300 ease-in-out flex items-center justify-center"
      title="สลับมุมมองแอดมิน"
    >
      <FaUserShield className="text-xl" />
    </button>
  );
}
