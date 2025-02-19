// import connectToDatabase from "../../../utils/db";
// import User from "../../../models/User";

// connectToDatabase();

// export async function GET(req: Request) {
//   try {
//     const totalUsers = await User.countDocuments(); // จำนวนผู้ใช้ทั้งหมด
//     const onlineUsers = await User.countDocuments({ isOnline: true }); // จำนวนผู้ใช้ออนไลน์

//     return new Response(
//       JSON.stringify({ totalUsers, onlineUsers }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ message: "Failed to fetch user data", error }),
//       { status: 500 }
//     );
//   }
// }


// /api/users/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";

export async function GET(req: Request) {
  try {
    // เชื่อมต่อกับฐานข้อมูล
    await connectToDatabase();

    const totalUsers = await User.countDocuments(); // จำนวนผู้ใช้ทั้งหมด
    const onlineUsers = await User.countDocuments({ isOnline: true }); // จำนวนผู้ใช้ออนไลน์

    // ส่งข้อมูลเป็น JSON
    return NextResponse.json(
      { totalUsers, onlineUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return NextResponse.json(
      { message: "Failed to fetch user data", error },
      { status: 500 }
    );
  }
}

