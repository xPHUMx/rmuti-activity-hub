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

import connectToDatabase from "../../../../utils/db";
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

    const user = await User.findById(userId).populate("registeredActivities");
    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(user.registeredActivities), {  
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
  
    // ตรวจสอบและแสดงข้อความข้อผิดพลาดที่เหมาะสม
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
  
    return new Response(
      JSON.stringify({
        message: "Failed to fetch registrations",
        error: errorMessage,
      }),
      { status: 500 }
    ); 
  } 
}
