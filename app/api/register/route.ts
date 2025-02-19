
// import connectToDatabase from "../../../utils/db";
// import Activity from "../../../models/Activity";
// import User from "../../../models/User";

// connectToDatabase();

// export async function POST(req: Request) {
//     try {
//         const { activityId, participant, userId } = await req.json();
//         console.log("Request Data:", { activityId, participant, userId });
      
//         if (!activityId || !participant || !userId) {
//           return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
//         }
      
//         const activity = await Activity.findById(activityId);
//         if (!activity) {
//           return new Response(JSON.stringify({ message: "Activity not found" }), { status: 404 });
//         }
      
//         if (activity.status === "closed") {
//           return new Response(JSON.stringify({ message: "Registration is closed" }), { status: 400 });
//         }
      
//         if (activity.participants.length >= activity.maxParticipants) {
//           return new Response(JSON.stringify({ message: "Activity is fully booked" }), { status: 400 });
//         }
      
//         const alreadyRegistered = activity.participants.some(
//           (p) => p.studentId === participant.studentId
//         );
//         if (alreadyRegistered) {
//           return new Response(JSON.stringify({ message: "Participant already registered" }), { status: 400 });
//         }
      
//         activity.participants.push(participant);
//         await activity.save();
      
//         const user = await User.findById(userId);
//         if (!user) {
//           return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
//         }
      
//         const isAlreadyRegistered = user.registeredActivities.some(
//           (reg) => reg.activityId.toString() === activityId
//         );
      
//         if (!isAlreadyRegistered) {
//           user.registeredActivities.push({ activityId, registrationDate: new Date() });
//           await user.save();
//         }
      
//         return new Response(JSON.stringify({ message: "Registration successful" }), { status: 200 });
//       } catch (error) {
//         console.error("Error during registration:", error); // เพิ่มการ Debug
//         return new Response(
//           JSON.stringify({ message: "Failed to register", error: error.message }),
//           { status: 500 }
//         );
//       }
//     }      


// import { NextRequest, NextResponse } from "next/server";
// import connectToDatabase from "../../../utils/db";
// import Activity from "../../../models/Activity";
// import User from "../../../models/User";

// connectToDatabase();

// export async function POST(req: NextRequest) {
//   try {
//     const { activityId, participant, userId } = await req.json();

//     if (!activityId || !participant || !userId) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // ตรวจสอบกิจกรรม
//     const activity = await Activity.findById(activityId);
//     if (!activity) {
//       return NextResponse.json(
//         { message: "Activity not found" },
//         { status: 404 }
//       );
//     }

//     if (activity.status === "closed") {
//       return NextResponse.json(
//         { message: "Registration is closed" },
//         { status: 400 }
//       );
//     }

//     if (activity.participants.length >= activity.maxParticipants) {
//       return NextResponse.json(
//         { message: "Activity is fully booked" },
//         { status: 400 }
//       );
//     }

//     const alreadyRegistered = activity.participants.some(
//       (p: { studentId: string }) => p.studentId === participant.studentId
//     );
//     if (alreadyRegistered) {
//       return NextResponse.json(
//         { message: "Participant already registered" },
//         { status: 400 }
//       );
//     }

//     // เพิ่มผู้เข้าร่วมกิจกรรม
//     activity.participants.push(participant);
//     await activity.save();

//     // ตรวจสอบผู้ใช้
//     const user = await User.findById(userId);
//     if (!user) {
//       return NextResponse.json(
//         { message: "User not found" },
//         { status: 404 }
//       );
//     }

//     const isAlreadyRegistered = user.registeredActivities.some(
//       (reg: { activityId: string }) =>
//         reg.activityId.toString() === activityId.toString()
//     );

//     if (!isAlreadyRegistered) {
//       user.registeredActivities.push({
//         activityId,
//         registrationDate: new Date(),
//       });
//       await user.save();
//     }

//     return NextResponse.json(
//       { message: "Registration successful" },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error during registration:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to register",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }


// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import connectToDatabase from "../../../utils/db";
// import Activity from "../../../models/Activity";
// import User from "../../../models/User";

// connectToDatabase();

// export async function POST(req: NextRequest) {
//   try {
//     const { activityId, participant, userId } = await req.json();

//     if (!activityId || !participant || !userId) {
//       return NextResponse.json(
//         { message: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // ตรวจสอบกิจกรรม
//     const activity = await Activity.findById(activityId);
//     if (!activity) {
//       return NextResponse.json(
//         { message: "Activity not found" },
//         { status: 404 }
//       );
//     }

//     if (activity.status === "closed") {
//       return NextResponse.json(
//         { message: "Registration is closed" },
//         { status: 400 }
//       );
//     }

//     if (activity.participants.length >= activity.maxParticipants) {
//       return NextResponse.json(
//         { message: "Activity is fully booked" },
//         { status: 400 }
//       );
//     }

//     const alreadyRegistered = activity.participants.some(
//       (p: { studentId: string }) => p.studentId === participant.studentId
//     );
//     if (alreadyRegistered) {
//       return NextResponse.json(
//         { message: "Participant already registered" },
//         { status: 400 }
//       );
//     }

//     // เพิ่มผู้เข้าร่วมกิจกรรม
//     activity.participants.push(participant);

//     // ตรวจสอบจำนวนผู้เข้าร่วมและเปลี่ยนสถานะเป็น "closed" หากครบจำนวน
//     if (activity.participants.length >= activity.maxParticipants) {
//       activity.status = "closed";
//     }

//     await activity.save();

//     // ตรวจสอบ userId และแปลงเป็น ObjectId (หากจำเป็น)
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return NextResponse.json(
//         { message: "Invalid User ID format" },
//         { status: 400 }
//       );
//     }

//     const userObjectId = new mongoose.Types.ObjectId(userId);

//     // ตรวจสอบผู้ใช้
//     const user = await User.findById(userObjectId);
//     if (!user) {
//       return NextResponse.json(
//         { message: "User not found" },
//         { status: 404 }
//       );
//     }

//     const isAlreadyRegistered = user.registeredActivities.some(
//       (reg: { activityId: string }) =>
//         reg.activityId.toString() === activityId.toString()
//     );

//     if (!isAlreadyRegistered) {
//       user.registeredActivities.push({
//         activityId,
//         registrationDate: new Date(),
//       });
//       await user.save();
//     }

//     return NextResponse.json(
//       { message: "Registration successful" },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error during registration:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to register",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../utils/db";
import Activity from "../../../models/Activity";
import User from "../../../models/User";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const { activityId, participant, userId } = await req.json();

    if (!activityId || !participant || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ตรวจสอบกิจกรรม
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return NextResponse.json(
        { message: "Activity not found" },
        { status: 404 }
      );
    }

    if (activity.status === "closed") {
      return NextResponse.json(
        { message: "Registration is closed" },
        { status: 400 }
      );
    }

    if (activity.participants.length >= activity.maxParticipants) {
      return NextResponse.json(
        { message: "Activity is fully booked" },
        { status: 400 }
      );
    }

    // เพิ่มผู้เข้าร่วมกิจกรรม
    activity.participants.push(participant);

    // ตรวจสอบจำนวนผู้เข้าร่วมและเปลี่ยนสถานะเป็น "closed" หากครบจำนวน
    if (activity.participants.length >= activity.maxParticipants) {
      activity.status = "closed";
    }

    await activity.save();

    // เพิ่มกิจกรรมที่ผู้ใช้ลงทะเบียนใน registeredActivities
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    user.registeredActivities.push({
      activityId,
      registrationDate: new Date(),
    });
    await user.save();

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      {
        message: "Failed to register",
        error: error.message,
      },
      { status: 500 }
    );
  }
}