
// import { NextRequest, NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import News from "@/models/News"; // แก้เป็น News แทน User
// import mongoose from "mongoose";

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> } // ✅ ใช้ Promise
// ) {
//   await connectToDatabase();

//   try {
//     const { id } = await context.params; // ✅ ใช้ await ดึงค่า params

//     console.log("🟡 API received request for News ID:", id);

//     // ตรวจสอบว่า id เป็น ObjectId ที่ถูกต้อง
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
//     }

//     const news = await News.findById(id);
//     if (!news) {
//       console.log("🔴 News not found in DB");
//       return NextResponse.json({ error: "News not found" }, { status: 404 });
//     }

//     console.log("🟢 News found:", news);
//     return NextResponse.json(news);
//   } catch (error) {
//     console.error("🔴 Error retrieving news:", error);
//     return NextResponse.json({ error: "Failed to retrieve news data" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import connectToDatabase from "@/utils/db";
// import News from "@/models/News"; // แก้เป็น News แทน User
// import mongoose from "mongoose";

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> } // ✅ ใช้ Promise
// ) {
//   await connectToDatabase();

//   try {
//     const { id } = await context.params; // ✅ ใช้ await ดึงค่า params

//     console.log("🟡 API received request for News ID:", id);

//     // ตรวจสอบว่า id เป็น ObjectId ที่ถูกต้อง
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
//     }

//     const news = await News.findById(id);
//     if (!news) {
//       console.log("🔴 News not found in DB");
//       return NextResponse.json({ error: "News not found" }, { status: 404 });
//     }

//     console.log("🟢 News found:", news);
//     return NextResponse.json(news);
//   } catch (error) {
//     console.error("🔴 Error retrieving news:", error);
//     return NextResponse.json({ error: "Failed to retrieve news data" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import News from "@/models/News";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const { id } = params; // ❌ ไม่ต้อง await

    console.log("🟡 API received request for News ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const news = await News.findById(id);
    if (!news) {
      console.log("🔴 News not found in DB");
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    console.log("🟢 News found:", news);
    return NextResponse.json(news);
  } catch (error) {
    console.error("🔴 Error retrieving news:", error);
    return NextResponse.json({ error: "Failed to retrieve news data" }, { status: 500 });
  }
}
