// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";

// // ดึงข้อมูลนักศึกษารายบุคคล
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

// import { NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import User from "@/models/User";
// import mongoose from "mongoose";

// // ดึงข้อมูลนักศึกษารายบุคคล
// export async function GET(req: Request, context: { params: { id: string } }) {
//   await connectToDatabase();

//   const { id } = context.params; // ใช้ params จาก context

//   // ตรวจสอบว่า id เป็น ObjectId ที่ถูกต้อง
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
//   }

//   try {
//     const user = await User.findById(id); // ใช้ Mongoose เพื่อดึงข้อมูลผู้ใช้ตาม ID
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(user); // ส่งข้อมูลผู้ใช้กลับ
//   } catch (error) {
//     console.error("Error retrieving user:", error);
//     return NextResponse.json({ error: "Failed to retrieve user data" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ ใช้ Promise
) {
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
