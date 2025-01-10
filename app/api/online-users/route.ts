// import { NextResponse } from "next/server";
// import connectToDatabase from "../../../utils/db";

// // POST Method: เพิ่มสถานะผู้ใช้ออนไลน์
// export async function POST(req: Request) {
//   console.log("POST /api/online-users called");
//   try {
//     const body = await req.json().catch(() => null);

//     // ตรวจสอบว่า userId ถูกส่งมาหรือไม่
//     if (!body || !body.userId) {
//       return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//     }

//     const { userId } = body;
//     const db = await connectToDatabase();

//     console.log("Adding or updating userId:", userId);

//     // เพิ่มหรืออัปเดตสถานะผู้ใช้ออนไลน์
//     await db.collection("onlineUsers").updateOne(
//       { userId },
//       { $set: { userId, lastActive: new Date() } },
//       { upsert: true }
//     );

//     // นับจำนวนผู้ใช้ออนไลน์
//     const onlineUsers = await db.collection("onlineUsers").find().toArray();

//     return NextResponse.json(
//       { count: onlineUsers.length, users: onlineUsers },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in POST /api/online-users:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // DELETE Method: ลบสถานะผู้ใช้ออนไลน์
// export async function DELETE(req: Request) {
//   console.log("DELETE /api/online-users called");
//   try {
//     const body = await req.json().catch(() => null);

//     // ตรวจสอบว่า userId ถูกส่งมาหรือไม่
//     if (!body || !body.userId) {
//       return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//     }

//     const { userId } = body;
//     const db = await connectToDatabase();

//     console.log("Removing userId:", userId);

//     // ลบสถานะผู้ใช้ออกจากฐานข้อมูล
//     await db.collection("onlineUsers").deleteOne({ userId });

//     // นับจำนวนผู้ใช้ออนไลน์หลังการลบ
//     const onlineUsers = await db.collection("onlineUsers").find().toArray();

//     return NextResponse.json(
//       { count: onlineUsers.length, users: onlineUsers },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in DELETE /api/online-users:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectToDatabase from "../../../utils/db";

// GET Method: ดึงจำนวนผู้ใช้ออนไลน์
export async function GET() {
  console.log("GET /api/online-users called");
  try {
    const db = await connectToDatabase();

    // ดึงข้อมูลผู้ใช้ออนไลน์
    const onlineUsers = await db.collection("onlineUsers").find().toArray();

    console.log("Online users:", onlineUsers);

    return NextResponse.json(
      { count: onlineUsers.length, users: onlineUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/online-users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST Method: เพิ่มหรืออัปเดตสถานะผู้ใช้ออนไลน์
export async function POST(req: Request) {
  console.log("POST /api/online-users called");
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { userId } = body;
    const db = await connectToDatabase();

    console.log("Adding or updating userId:", userId);

    // เพิ่มหรืออัปเดตสถานะผู้ใช้ออนไลน์
    await db.collection("onlineUsers").updateOne(
      { userId },
      { $set: { userId, lastActive: new Date() } },
      { upsert: true }
    );

    // นับจำนวนผู้ใช้ออนไลน์
    const onlineUsers = await db.collection("onlineUsers").find().toArray();

    return NextResponse.json(
      { count: onlineUsers.length, users: onlineUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/online-users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE Method: ลบสถานะผู้ใช้ออนไลน์
export async function DELETE(req: Request) {
  console.log("DELETE /api/online-users called");
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { userId } = body;
    const db = await connectToDatabase();

    console.log("Removing userId:", userId);

    // ลบสถานะผู้ใช้ออกจากฐานข้อมูล
    await db.collection("onlineUsers").deleteOne({ userId });

    // นับจำนวนผู้ใช้ออนไลน์หลังการลบ
    const onlineUsers = await db.collection("onlineUsers").find().toArray();

    return NextResponse.json(
      { count: onlineUsers.length, users: onlineUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/online-users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
