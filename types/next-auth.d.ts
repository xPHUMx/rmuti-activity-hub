// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string; // เพิ่ม role
      id: string;   // เพิ่ม id
    };
  }

  interface JWT {
    role: string; // เพิ่ม role
    id: string;   // เพิ่ม id
  }
}
