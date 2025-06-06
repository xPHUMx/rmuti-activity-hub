

import { NextResponse } from "next/server";
import connectToDatabase from "../../../utils/db";

// ตั้งค่าหมดอายุของสถานะผู้ใช้ออนไลน์ (เช่น 5 นาที)
const ONLINE_TIMEOUT = 30 * 60 * 1000;

// 🔹 ฟังก์ชันล้างผู้ใช้ออนไลน์ที่หมดอายุ
async function cleanExpiredUsers(db: any) {
  const now = new Date();
  const expiredTime = new Date(now.getTime() - ONLINE_TIMEOUT);
  await db.collection("onlineUsers").deleteMany({ lastActive: { $lt: expiredTime } });
}

// ✅ GET Method: ดึงจำนวนผู้ใช้ออนไลน์
export async function GET() {
  console.log("✅ GET /api/online-users called");
  try {
    const db = await connectToDatabase();

    // 🔹 ล้างผู้ใช้ออนไลน์ที่หมดอายุออกก่อน
    await cleanExpiredUsers(db);

    // 🔹 ดึงข้อมูลผู้ใช้ออนไลน์ล่าสุด
    const onlineUsers = await db.collection("onlineUsers").find().toArray();

    console.log("📊 Online Users:", onlineUsers);

    return NextResponse.json(
      { count: onlineUsers.length, users: onlineUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in GET /api/online-users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST Method: เพิ่มหรืออัปเดตสถานะผู้ใช้ออนไลน์
export async function POST(req: Request) {
  console.log("✅ POST /api/online-users called");
  try {
    const body = await req.json();

    if (!body || !body.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { userId } = body;
    const db = await connectToDatabase();

    // 🔹 ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const existingUser = await db.collection("onlineUsers").findOne({ userId });

    if (!existingUser) {
      console.log("🟢 Adding new online user:", userId);
      await db.collection("onlineUsers").insertOne({ userId, lastActive: new Date() });
    } else {
      console.log("⚠️ User already online:", userId);
      await db.collection("onlineUsers").updateOne(
        { userId },
        { $set: { lastActive: new Date() } }
      );
    }

    // 🔹 ล้างผู้ใช้ออนไลน์ที่หมดอายุออกก่อน
    await cleanExpiredUsers(db);

    // 🔹 นับจำนวนผู้ใช้ออนไลน์ล่าสุด
    const onlineUsers = await db.collection("onlineUsers").find().toArray();
    return NextResponse.json(
      { count: onlineUsers.length, users: onlineUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in POST /api/online-users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE Method: ลบสถานะผู้ใช้ออนไลน์
export async function DELETE(req: Request) {
  console.log("✅ DELETE /api/online-users called");

  try {
    const body = await req.json();
    console.log("🔍 Received body:", body); // ✅ Debug จุดนี้

    if (!body || !body.userId) {
      console.log("⚠️ Missing userId in DELETE request");
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { userId } = body;
    const db = await connectToDatabase();

    console.log("🛑 Attempting to delete user:", userId);
    const result = await db.collection("onlineUsers").deleteOne({ userId });

    if (result.deletedCount === 0) {
      console.log("⚠️ User not found in onlineUsers:", userId);
    } else {
      console.log("✅ User deleted:", userId);
    }

    await cleanExpiredUsers(db);

    const onlineUsers = await db.collection("onlineUsers").find().toArray();
    return NextResponse.json(
      { count: onlineUsers.length, users: onlineUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in DELETE /api/online-users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
