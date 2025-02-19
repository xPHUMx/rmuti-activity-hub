// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";

// export async function POST(req: Request) {
//   try {
//     await connectToDatabase();
//     const body = await req.json();

//     console.log("🔍 Data received from Frontend:", body); // ✅ Debug ข้อมูลที่ได้รับจาก Frontend

//     const { email, fullName, studentId, department, year, phone } = body;

//     const user = await User.findOneAndUpdate(
//       { email },
//       { 
//         $set: { // ✅ บังคับ MongoDB อัปเดตข้อมูลใหม่
//           name: fullName, 
//           studentId, 
//           department, 
//           year, 
//           phone 
//         }
//       },
//       { new: true, upsert: true }
//     );
    
//     console.log("✅ Updated User in DB:", user); // ✅ Debug เช็คค่าอีกครั้ง
    

//     console.log("✅ Updated User in DB:", user); // ✅ Debug ข้อมูลที่อัปเดตใน MongoDB

//     return NextResponse.json({ message: "Profile updated", user });
//   } catch (error) {
//     console.error("❌ Error updating profile:", error); // ✅ Debug ถ้ามี error
//     return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";

// export async function POST(req: Request) {
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

export async function PATCH(req: Request) { // เปลี่ยนจาก POST เป็น PATCH
  try {
    // เชื่อมต่อกับฐานข้อมูล
    await connectToDatabase();

    // รับข้อมูลที่ส่งมาจาก frontend
    const body = await req.json();

    console.log("🔍 Data received from Frontend:", body); // ตรวจสอบข้อมูลที่ได้รับ

    const { email, fullName, studentId, department, year, phone } = body;

    // ตรวจสอบว่า email ถูกส่งมาหรือไม่
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ค้นหาผู้ใช้จากฐานข้อมูลที่ตรงกับ email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // อัปเดตข้อมูลของผู้ใช้
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { 
        $set: {
          name: fullName, 
          studentId, 
          department, 
          year, 
          phone
        }
      },
      { new: true } // ให้ดึงข้อมูลผู้ใช้ที่อัปเดตแล้ว
    );

    console.log("✅ Updated User in DB:", updatedUser); // ตรวจสอบข้อมูลที่อัปเดตในฐานข้อมูล

    // ส่งข้อมูลที่อัปเดตกลับไป
    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating profile:", error); // ถ้ามีข้อผิดพลาด
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}
