
// import connectToDatabase from "../../../utils/db";
// import Activity from "../../../models/Activity";
// import User from "../../../models/User";

// // เชื่อมต่อฐานข้อมูล
// connectToDatabase();

// // อินเทอร์เฟซสำหรับ Participant
// interface Participant {
//   fullName: string;
//   studentId: string;
//   year: string;
//   phone: string;
//   registeredAt?: Date;
// }

// // GET: ดึงข้อมูลกิจกรรมทั้งหมด
// export async function GET(req: Request) {
//   try {
//     const now = new Date();

//     // อัปเดตสถานะกิจกรรม (ปิดเมื่อหมดเวลา)
//     await Activity.updateMany(
//       { closeTime: { $lte: now }, status: "open" },
//       { $set: { status: "closed" } }
//     );

//     // ดึงกิจกรรมทั้งหมด
//     const activities = await Activity.find({});
//     return new Response(JSON.stringify(activities), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching activities:", error);

//     const errMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";

//     return new Response(
//       JSON.stringify({ message: "Failed to fetch activities", error: errMessage }),
//       { status: 500 }
//     );
//   }
// }

// // POST: เพิ่มกิจกรรมใหม่
// export async function POST(req: Request) {
//   try {
//     const data = await req.json();

//     // ตรวจสอบความสมบูรณ์ของข้อมูล
//     const { title, time, closeTime, location, maxParticipants } = data;
//     if (!title || !time || !closeTime || !location || !maxParticipants) {
//       return new Response(
//         JSON.stringify({ message: "Missing required fields" }),
//         { status: 400 }
//       );
//     }

//     // เพิ่มกิจกรรมใหม่
//     const newActivity = new Activity(data);
//     await newActivity.save();
//     return new Response(JSON.stringify(newActivity), { status: 201 });
//   } catch (error) {
//     console.error("Error creating activity:", error);

//     const errMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";

//     return new Response(
//       JSON.stringify({ message: "Failed to create activity", error: errMessage }),
//       { status: 500 }
//     );
//   }
// }

// // PUT: อัปเดตข้อมูลกิจกรรม
// export async function PUT(req: Request) {
//   try {
//     const { id, updates } = await req.json();

//     if (!id) {
//       return new Response(
//         JSON.stringify({ message: "Activity ID is required" }),
//         { status: 400 }
//       );
//     }

//     const updatedActivity = await Activity.findByIdAndUpdate(id, updates, {
//       new: true,
//     });

//     if (!updatedActivity) {
//       return new Response(
//         JSON.stringify({ message: "Activity not found" }),
//         { status: 404 }
//       );
//     }

//     return new Response(JSON.stringify(updatedActivity), { status: 200 });
//   } catch (error) {
//     console.error("Error updating activity:", error);

//     const errMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";

//     return new Response(
//       JSON.stringify({
//         message: "Failed to update activity",
//         error: errMessage,
//       }),
//       { status: 500 }
//     );
//   }
// }

// // PATCH: เพิ่มผู้ลงทะเบียน
// export async function PATCH(req: Request) {
//   try {
//     const { id, participant, userId } = await req.json();

//     if (!id || !participant || !userId) {
//       return new Response(
//         JSON.stringify({ message: "Missing required fields" }),
//         { status: 400 }
//       );
//     }

//     const activity = await Activity.findById(id);

//     if (!activity) {
//       return new Response(
//         JSON.stringify({ message: "Activity not found" }),
//         { status: 404 }
//       );
//     }

//     if (activity.status === "closed") {
//       return new Response(
//         JSON.stringify({ message: "Registration is closed" }),
//         { status: 400 }
//       );
//     }

//     const isDuplicate = activity.participants.some((p: Participant) => {
//       return p.studentId === participant.studentId;
//     });

//     if (isDuplicate) {
//       return new Response(
//         JSON.stringify({ message: "Duplicate registration" }),
//         { status: 400 }
//       );
//     }

//     activity.participants.push(participant);
//     const updatedActivity = await activity.save();

//     await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { registeredActivities: id } },
//       { new: true }
//     );

//     return new Response(JSON.stringify(updatedActivity), { status: 200 });
//   } catch (error) {
//     console.error("Error registering participant:", error);

//     const errMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";

//     return new Response(
//       JSON.stringify({
//         message: "Failed to register participant",
//         error: errMessage,
//       }),
//       { status: 500 }
//     );
//   }
// }

// // DELETE: ลบกิจกรรม
// export async function DELETE(req: Request) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return new Response(JSON.stringify({ message: "Missing activity ID" }), {
//         status: 400,
//       });
//     }

//     const deletedActivity = await Activity.findByIdAndDelete(id);

//     if (!deletedActivity) {
//       return new Response(
//         JSON.stringify({ message: "Activity not found" }),
//         { status: 404 }
//       );
//     }

//     return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
//   } catch (error) {
//     console.error("Error deleting activity:", error);

//     const errMessage =
//       error instanceof Error ? error.message : "An unknown error occurred";

//     return new Response(
//       JSON.stringify({ message: "Failed to delete activity", error: errMessage }),
//       { status: 500 }
//     );
//   }
// }



import connectToDatabase from "../../../utils/db";
import Activity from "../../../models/Activity";
import User from "../../../models/User";

// เชื่อมต่อฐานข้อมูล
connectToDatabase();

// อินเทอร์เฟซสำหรับ Participant
interface Participant {
  fullName: string;
  studentId: string;
  year: string;
  phone: string;
  registeredAt?: Date;
}

// GET: ดึงข้อมูลกิจกรรมทั้งหมด
export async function GET(req: Request) {
  try {
    const now = new Date();

    // อัปเดตสถานะกิจกรรม (ปิดเมื่อหมดเวลา)
    await Activity.updateMany(
      { closeTime: { $lte: now }, status: "open" },
      { $set: { status: "closed" } }
    );

    // ดึงกิจกรรมทั้งหมด
    const activities = await Activity.find({});
    return new Response(JSON.stringify(activities), { status: 200 });
  } catch (error) {
    console.error("Error fetching activities:", error);

    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(
      JSON.stringify({ message: "Failed to fetch activities", error: errMessage }),
      { status: 500 }
    );
  }
}

// POST: เพิ่มกิจกรรมใหม่
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ตรวจสอบความสมบูรณ์ของข้อมูล
    const { title, time, closeTime, location, maxParticipants } = data;
    if (!title || !time || !closeTime || !location || !maxParticipants) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // เพิ่มกิจกรรมใหม่
    const newActivity = new Activity(data);
    await newActivity.save();
    return new Response(JSON.stringify(newActivity), { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);

    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(
      JSON.stringify({ message: "Failed to create activity", error: errMessage }),
      { status: 500 }
    );
  }
}

// PUT: อัปเดตข้อมูลกิจกรรม
export async function PUT(req: Request) {
  try {
    const { id, updates } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Activity ID is required" }),
        { status: 400 }
      );
    }

    const updatedActivity = await Activity.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedActivity) {
      return new Response(
        JSON.stringify({ message: "Activity not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updatedActivity), { status: 200 });
  } catch (error) {
    console.error("Error updating activity:", error);

    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(
      JSON.stringify({
        message: "Failed to update activity",
        error: errMessage,
      }),
      { status: 500 }
    );
  }
}

// PATCH: เพิ่มผู้ลงทะเบียน
export async function PATCH(req: Request) {
  try {
    const { id, participant, userId } = await req.json();

    console.log("Received data:", { id, participant, userId }); // Debug

    if (!id || !participant || !userId) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const activity = await Activity.findById(id);
    console.log("Found activity:", activity); // Debug

    if (!activity) {
      return new Response(
        JSON.stringify({ message: "Activity not found" }),
        { status: 404 }
      );
    }

    if (activity.status === "closed") {
      return new Response(
        JSON.stringify({ message: "Registration is closed" }),
        { status: 400 }
      );
    }

    const isDuplicate = activity.participants.some((p: Participant) => {
      return p.studentId === participant.studentId;
    });

    if (isDuplicate) {
      return new Response(
        JSON.stringify({ message: "Duplicate registration" }),
        { status: 400 }
      );
    }

    activity.participants.push(participant);
    const updatedActivity = await activity.save();
    console.log("Updated activity:", updatedActivity); // Debug

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { registeredActivities: id } },
      { new: true }
    );

    return new Response(JSON.stringify(updatedActivity), { status: 200 });
  } catch (error) {
    console.error("Error registering participant:", error);

    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(
      JSON.stringify({
        message: "Failed to register participant",
        error: errMessage,
      }),
      { status: 500 }
    );
  }
}

// DELETE: ลบกิจกรรม
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ message: "Missing activity ID" }), {
        status: 400,
      });
    }

    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return new Response(
        JSON.stringify({ message: "Activity not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting activity:", error);

    const errMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(
      JSON.stringify({ message: "Failed to delete activity", error: errMessage }),
      { status: 500 }
    );
  }
}

