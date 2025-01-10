'use client'


import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider><Navbar />{children}</SessionProvider>;
}

// 'use client'

// import { SessionProvider } from "next-auth/react";
// import Navbar from "@/components/Navbar";

// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <SessionProvider>
//       {/* เพิ่ม Navbar ที่จะแสดงในทุกหน้า */}
//       <Navbar />
//       {children} {/* เนื้อหาของหน้า */}
//     </SessionProvider>
//   );
// }
