
// import connectToDatabase from "../../../../utils/db";
// import mongoose from "mongoose";
// import User from "../../../../models/User";

// connectToDatabase();

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!userId) {
//       return new Response(
//         JSON.stringify({ message: "User ID is required" }),
//         { status: 400 }
//       );
//     }

//     // ตรวจสอบว่า userId เป็น ObjectId ที่ถูกต้อง
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return new Response(
//         JSON.stringify({ message: "Invalid User ID format" }),
//         { status: 400 }
//       );
//     }

//     console.log("Fetching registrations for userId:", userId);

//     const user = await User.findById(userId).populate({
//       path: "registeredActivities.activityId",
//       select: "_id title description time location", // ดึงเฉพาะฟิลด์ที่ต้องการ
//     });

//     if (!user) {
//       console.error("User not found:", userId);
//       return new Response(
//         JSON.stringify({ message: "User not found" }),
//         { status: 404 }
//       );
//     }

//     // หากไม่มีการลงทะเบียน
//     if (user.registeredActivities.length === 0) {
//       return new Response(
//         JSON.stringify({ message: "No registered activities found" }),
//         { status: 200 }
//       );
//     }

//     // ส่งข้อมูล registeredActivities
//     return new Response(JSON.stringify(user.registeredActivities), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error fetching registrations:", error);

//     return new Response(
//       JSON.stringify({
//         message: "Failed to fetch registrations",
//         error: error instanceof Error ? error.message : "Unknown error occurred",
//       }),
//       { status: 500 }
//     );
//   }
// }


import connectToDatabase from "../../../../utils/db";
import mongoose from "mongoose";
import User from "../../../../models/User";

// เชื่อมต่อกับฐานข้อมูล
connectToDatabase();

export async function GET(req: Request) {
  try {
    // ดึง searchParams จาก URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // ตรวจสอบว่า userId ถูกส่งมาหรือไม่
    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User ID is required" }),
        { status: 400 }
      );
    }

    // ตรวจสอบว่า userId เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(
        JSON.stringify({ message: "Invalid User ID format" }),
        { status: 400 }
      );
    }

    console.log("Fetching registrations for userId:", userId);

    // ค้นหาผู้ใช้โดยใช้ userId และ populate ข้อมูลกิจกรรมที่ลงทะเบียน
    const user = await User.findById(userId).populate({
      path: "registeredActivities.activityId",
      select: "_id title description time location", // ดึงข้อมูลกิจกรรมที่เกี่ยวข้อง
    });

    // ตรวจสอบว่าไม่พบผู้ใช้
    if (!user) {
      console.error("User not found:", userId);
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // ถ้าผู้ใช้ไม่มีการลงทะเบียนกิจกรรม
    if (user.registeredActivities.length === 0) {
      return new Response(
        JSON.stringify({ message: "No registered activities found" }),
        { status: 200 }
      );
    }

    // ส่งข้อมูลกิจกรรมที่ลงทะเบียน
    return new Response(JSON.stringify(user.registeredActivities), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);

    // ส่งข้อผิดพลาดเมื่อเกิดปัญหากับ API
    return new Response(
      JSON.stringify({
        message: "Failed to fetch registrations",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500 }
    );
  }
}
