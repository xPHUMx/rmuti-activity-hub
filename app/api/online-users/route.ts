import { NextResponse } from "next/server";

let onlineUsers: Set<string> = new Set(); // Set เพื่อเก็บ userId ของคนออนไลน์

// GET: ดึงจำนวนผู้ใช้ออนไลน์
export async function GET() {
  return NextResponse.json({ count: onlineUsers.size });
}

// POST: เพิ่มผู้ใช้ออนไลน์
export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  onlineUsers.add(userId); // เพิ่ม userId เข้าไปใน onlineUsers
  return NextResponse.json({ message: "User marked as online" });
}

// DELETE: ลบผู้ใช้ออกจากสถานะออนไลน์
export async function DELETE(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  onlineUsers.delete(userId); // ลบ userId ออกจาก onlineUsers
  return NextResponse.json({ message: "User marked as offline" });
}
