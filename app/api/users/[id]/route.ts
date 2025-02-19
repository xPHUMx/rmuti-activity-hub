// // /api/users/[id]/route.ts
// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   await connectToDatabase();
  
//   console.log("🟡 API received request for ID:", params.id); // ✅ Debug

//   const user = await User.findById(params.id);
//   if (!user) {
//     console.log("🔴 User not found in DB");
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   console.log("🟢 User found:", user);
//   return NextResponse.json(user);
// }

// // เพิ่มฟังก์ชัน PATCH สำหรับอัปเดตข้อมูล
// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   await connectToDatabase();
  
//   const { fullName, studentId, department, year, phone } = await req.json(); // รับข้อมูลจาก frontend

//   const user = await User.findByIdAndUpdate(params.id, {
//     name: fullName,
//     studentId,
//     department,
//     year,
//     phone
//   }, { new: true });

//   if (!user) {
//     console.log("🔴 User not found for update");
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   console.log("🟢 User updated:", user);
//   return NextResponse.json(user);
// }


// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   await connectToDatabase();

//   try {
//     // ตรวจสอบ params.id โดยทำการ await ก่อน
//     const userId = params.id;

//     console.log("🟡 API received request for ID:", userId); // ✅ Debug

//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("🔴 User not found in DB");
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     console.log("🟢 User found:", user);
//     return NextResponse.json(user);
//   } catch (error) {
//     console.error("🔴 Error:", error);
//     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//   }
// }

// // เพิ่มฟังก์ชัน PATCH สำหรับอัปเดตข้อมูล
// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   await connectToDatabase();

//   try {
//     const { fullName, studentId, department, year, phone } = await req.json(); // รับข้อมูลจาก frontend

//     const userId = params.id;

//     const user = await User.findByIdAndUpdate(userId, {
//       name: fullName,
//       studentId,
//       department,
//       year,
//       phone
//     }, { new: true });

//     if (!user) {
//       console.log("🔴 User not found for update");
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     console.log("🟢 User updated:", user);
//     return NextResponse.json(user);
//   } catch (error) {
//     console.error("🔴 Error:", error);
//     return NextResponse.json({ error: "An error occurred while updating user data" }, { status: 500 });
//   }
// }


// // /api/users/[id]/route.ts
// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   await connectToDatabase();
  
//   console.log("🟡 API received request for ID:", params.id); // ✅ Debug

//   const user = await User.findById(params.id);
//   if (!user) {
//     console.log("🔴 User not found in DB");
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   console.log("🟢 User found:", user);
//   return NextResponse.json(user);
// }

// // เพิ่มฟังก์ชัน PATCH สำหรับอัปเดตข้อมูล
// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   await connectToDatabase();
  
//   const { fullName, studentId, department, year, phone } = await req.json(); // รับข้อมูลจาก frontend

//   const user = await User.findByIdAndUpdate(params.id, {
//     name: fullName,
//     studentId,
//     department,
//     year,
//     phone
//   }, { new: true });

//   if (!user) {
//     console.log("🔴 User not found for update");
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   console.log("🟢 User updated:", user);
//   return NextResponse.json(user);
// }


import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectToDatabase();

  try {
    const { id } = await context.params; // ✅ ใช้ await ดึงค่า params

    console.log("🟡 API received request for ID:", id);

    const user = await User.findById(id);
    if (!user) {
      console.log("🔴 User not found in DB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("🟢 User found:", user);
    return NextResponse.json(user);
  } catch (error) {
    console.error("🔴 Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectToDatabase();

  try {
    const { fullName, studentId, department, year, phone } = await req.json();
    const { id } = await context.params; // ✅ ใช้ await กับ params

    const user = await User.findByIdAndUpdate(
      id,
      { name: fullName, studentId, department, year, phone },
      { new: true }
    );

    if (!user) {
      console.log("🔴 User not found for update");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("🟢 User updated:", user);
    return NextResponse.json(user);
  } catch (error) {
    console.error("🔴 Error:", error);
    return NextResponse.json({ error: "An error occurred while updating user data" }, { status: 500 });
  }
}
