// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req });
//   const pathname = req.nextUrl.pathname;

//   if (token) {
//     if (!token.hasProfile && pathname !== "/profile-setup") {
//       return NextResponse.redirect(new URL("/profile-setup", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/:path*", "/activities/:path*"],
// };


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const pathname = req.nextUrl.pathname;

//   // ✅ ถ้าไม่มี token ให้ไปหน้า login
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // ✅ ถ้ามี token แต่ยังไม่ได้ตั้งค่าโปรไฟล์ ให้ redirect ไปที่ /profile-setup
//   if (token && !token.hasProfile && pathname !== "/profile-setup") {
//     return NextResponse.redirect(new URL("/profile-setup", req.url));
//   }

//   return NextResponse.next();
// }

// // ✅ จำกัด middleware ให้ทำงานเฉพาะเส้นทางที่กำหนด
// export const config = {
//   matcher: ["/", "/register/:path*", "/profile-setup"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // ✅ ถ้าไม่มี token ให้ไปหน้า login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ ตรวจสอบว่า user มี role เป็น admin หรือไม่
  if (token.role !== "admin" && pathname.startsWith("/admin")) {
    // รีไดเรกต์ไปหน้า home หรือหน้าอื่น ๆ ที่คุณต้องการ
    return NextResponse.redirect(new URL("/", req.url)); // เปลี่ยนเส้นทางไปที่หน้า home ถ้าไม่ใช่ admin
  }

  // ✅ ถ้าผู้ใช้มี role เป็น admin ให้ไปที่หน้า admin ตามปกติ
  return NextResponse.next();
}

// ✅ จำกัด middleware ให้ทำงานเฉพาะเส้นทางที่เกี่ยวข้องกับ /admin
export const config = {
  matcher: [
    "/admin/:path*", // ทุกเส้นทางที่เริ่มต้นด้วย /admin
    "/admin", // หน้า /admin
  ],
};
