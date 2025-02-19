// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";

// // ดึงรายชื่อผู้ใช้ทั้งหมด
// export async function GET() {
//   await connectToDatabase();
//   const users = await User.find({}, "name email role studentId department year phone").sort({ role: 1 });
//   return NextResponse.json(users);
// }

// // อัปเดต Role ผู้ใช้
// export async function PATCH(req: Request) {
//   await connectToDatabase();
//   const { id, role } = await req.json();

//   if (!["user", "admin"].includes(role)) {
//     return NextResponse.json({ error: "Invalid role" }, { status: 400 });
//   }

//   const user = await User.findByIdAndUpdate(id, { role }, { new: true });
//   return NextResponse.json(user);
// }

import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

// ดึงรายชื่อผู้ใช้ทั้งหมด
export async function GET() {
  await connectToDatabase();
  const users = await User.find({}, "name email role studentId department year phone").sort({ role: 1 });
  return NextResponse.json(users);
}

// อัปเดตข้อมูลผู้ใช้ (รวมถึง Role)
export async function PATCH(req: Request) {
  await connectToDatabase();
  const { id, name, email, studentId, department, year, phone, role } = await req.json();

  // ตรวจสอบว่ามี ID หรือไม่
  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  // ตรวจสอบว่า Role เป็นค่าที่ถูกต้อง
  if (role && !["user", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // อัปเดตข้อมูลผู้ใช้
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { name, email, studentId, department, year, phone, role },
    { new: true }
  );

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updatedUser });
}
