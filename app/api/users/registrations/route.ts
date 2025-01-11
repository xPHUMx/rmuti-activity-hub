// import connectToDatabase from "../../../../utils/db";
// import User from "../../../../models/User";

// connectToDatabase();

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!userId) {
//       return new Response(JSON.stringify({ message: "User ID is required" }), {
//         status: 400,
//       });
//     }

//     const user = await User.findById(userId).populate("registeredActivities");

//     if (!user) {
//       return new Response(JSON.stringify({ message: "User not found" }), {
//         status: 404,
//       });
//     }

//     return new Response(JSON.stringify(user.registeredActivities), {
//       status: 200,
//     });
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ message: "Failed to fetch registrations", error }),
//       { status: 500 }
//     );
//   }
// }

// import connectToDatabase from "../../../../utils/db";
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

//     const user = await User.findById(userId).populate("registeredActivities");
//     if (!user) {
//       return new Response(
//         JSON.stringify({ message: "User not found" }),
//         { status: 404 }
//       );
//     }

//     return new Response(JSON.stringify(user.registeredActivities), {  
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error fetching registrations:", error);
  
//     // ตรวจสอบและแสดงข้อความข้อผิดพลาดที่เหมาะสม
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
  
//     return new Response(
//       JSON.stringify({
//         message: "Failed to fetch registrations",
//         error: errorMessage,
//       }),
//       { status: 500 }
//     ); 
//   } 
// }


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

//     const user = await User.findById(userId).populate("registeredActivities.activityId");
//     if (!user) {
//       return new Response(
//         JSON.stringify({ message: "User not found" }),
//         { status: 404 }
//       );
//     }

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

connectToDatabase();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User ID is required" }),
        { status: 400 }
      );
    }

    // ตรวจสอบว่า userId เป็น ObjectId ที่ถูกต้อง
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(
        JSON.stringify({ message: "Invalid User ID format" }),
        { status: 400 }
      );
    }

    console.log("Fetching registrations for userId:", userId);

    const user = await User.findById(userId).populate({
      path: "registeredActivities.activityId",
      select: "_id title description time location", // ดึงเฉพาะฟิลด์ที่ต้องการ
    });

    if (!user) {
      console.error("User not found:", userId);
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // หากไม่มีการลงทะเบียน
    if (user.registeredActivities.length === 0) {
      return new Response(
        JSON.stringify({ message: "No registered activities found" }),
        { status: 200 }
      );
    }

    // ส่งข้อมูล registeredActivities
    return new Response(JSON.stringify(user.registeredActivities), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);

    return new Response(
      JSON.stringify({
        message: "Failed to fetch registrations",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500 }
    );
  }
}
