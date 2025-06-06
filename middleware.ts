
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

//   // ✅ ตรวจสอบว่า user มี role เป็น admin หรือไม่
//   if (token.role !== "admin" && pathname.startsWith("/admin")) {
//     // รีไดเรกต์ไปหน้า home หรือหน้าอื่น ๆ ที่คุณต้องการ
//     return NextResponse.redirect(new URL("/", req.url)); // เปลี่ยนเส้นทางไปที่หน้า home ถ้าไม่ใช่ admin
//   }

//   // ✅ ถ้าผู้ใช้มี role เป็น admin ให้ไปที่หน้า admin ตามปกติ
//   return NextResponse.next();
// }

// // ✅ จำกัด middleware ให้ทำงานเฉพาะเส้นทางที่เกี่ยวข้องกับ /admin
// export const config = {
//   matcher: [
//     "/admin/:path*", // ทุกเส้นทางที่เริ่มต้นด้วย /admin
//     "/admin", // หน้า /admin
//   ],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  console.log("TOKEN FROM MIDDLEWARE:", token);

  // ❌ ไม่มี token = ยังไม่ login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ❌ ไม่ใช่ admin แต่จะเข้า /admin
  if (token.role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", // เส้นทางที่ต้องเป็น admin เท่านั้น
    "/admin",        // รวมหน้า admin root
  ],
};
