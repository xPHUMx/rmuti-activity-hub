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

  // ✅ ถ้ามี token แต่ยังไม่ได้ตั้งค่าโปรไฟล์ ให้ redirect ไปที่ /profile-setup
  if (token && !token.hasProfile && pathname !== "/profile-setup") {
    return NextResponse.redirect(new URL("/profile-setup", req.url));
  }

  return NextResponse.next();
}

// ✅ จำกัด middleware ให้ทำงานเฉพาะเส้นทางที่กำหนด
export const config = {
  matcher: ["/", "/register/:path*", "/profile-setup"],
};

