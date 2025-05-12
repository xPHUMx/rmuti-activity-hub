

// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";

// export async function PATCH(req: Request) { // เปลี่ยนจาก POST เป็น PATCH
//   try {
//     // เชื่อมต่อกับฐานข้อมูล
//     await connectToDatabase();

//     // รับข้อมูลที่ส่งมาจาก frontend
//     const body = await req.json();

//     console.log("🔍 Data received from Frontend:", body); // ตรวจสอบข้อมูลที่ได้รับ

//     const { email, fullName, studentId, department, year, phone } = body;

//     // ตรวจสอบว่า email ถูกส่งมาหรือไม่
//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     // ค้นหาผู้ใช้จากฐานข้อมูลที่ตรงกับ email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // อัปเดตข้อมูลของผู้ใช้
//     const updatedUser = await User.findOneAndUpdate(
//       { email },
//       { 
//         $set: {
//           name: fullName, 
//           studentId, 
//           department, 
//           year, 
//           phone
//         }
//       },
//       { new: true } // ให้ดึงข้อมูลผู้ใช้ที่อัปเดตแล้ว
//     );

//     console.log("✅ Updated User in DB:", updatedUser); // ตรวจสอบข้อมูลที่อัปเดตในฐานข้อมูล

//     // ส่งข้อมูลที่อัปเดตกลับไป
//     return NextResponse.json({ message: "Profile updated", user: updatedUser });
//   } catch (error) {
//     console.error("❌ Error updating profile:", error); // ถ้ามีข้อผิดพลาด
//     return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      email,
      fullName,
      studentId,
      department,
      program, // ✅ รับค่า program ด้วย
      year,
      phone,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: fullName,
          studentId: studentId,
          department: department,
          program: program, // ✅ อัปเดต program ด้วย
          year: year,
          phone: phone,
        },
      },
      { new: true }
    );

    console.log("✅ Updated user:", updatedUser);

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}
