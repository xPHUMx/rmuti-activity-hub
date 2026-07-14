
import fs from "fs";
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

    // ปิดกิจกรรมอัตโนมัติถ้าเวลาหมด
    await Activity.updateMany(
      { registerEnd: { $lte: now }, status: "open" },
      { $set: { status: "closed" } }
    );

    const activities = await Activity.find({}).populate("newsId"); // ดึงข่าวมาด้วย
    return new Response(JSON.stringify(activities), { status: 200 });
  } catch (error) {
    console.error("Error fetching activities:", error);

    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ message: "Failed to fetch activities", error: errMessage }), { status: 500 });
  }
}

// POST: เพิ่มกิจกรรมใหม่
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("POST /api/activities received:", data);

    const {
      title,
      newsId,
      registerStart,
      registerEnd,
      activityStart,
      activityEnd,
      location,
      maxParticipants,
      status,
    } = data;

    if (!title || !registerStart || !registerEnd || !activityStart || !activityEnd || !location || !maxParticipants) {
      const missingDetails = {
        title: !title,
        registerStart: !registerStart,
        registerEnd: !registerEnd,
        activityStart: !activityStart,
        activityEnd: !activityEnd,
        location: !location,
        maxParticipants: !maxParticipants,
        receivedData: data
      };
      console.warn("Validation failed. Missing required fields in POST /api/activities:", missingDetails);
      try {
        fs.appendFileSync(
          "C:\\Users\\Phums\\.gemini\\antigravity-ide\\scratch\\debug.log",
          JSON.stringify({ timestamp: new Date().toISOString(), ...missingDetails }) + "\n"
        );
      } catch (err) {
        console.error("Failed to write check-in debug log:", err);
      }
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const newActivity = new Activity({
      title,
      newsId: newsId || null,
      registerStart,
      registerEnd,
      activityStart,
      activityEnd,
      location,
      maxParticipants,
      status: status || "open",
    });

    await newActivity.save();
    return new Response(JSON.stringify(newActivity), { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);

    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ message: "Failed to create activity", error: errMessage }), { status: 500 });
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

    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ message: "Failed to update activity", error: errMessage }), { status: 500 });
  }
}

// PATCH: เพิ่มผู้ลงทะเบียน
export async function PATCH(req: Request) {
  try {
    const { id, participant, userId } = await req.json();

    if (!id || !participant || !userId) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const activity = await Activity.findById(id);

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

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { registeredActivities: id } },
      { new: true }
    );

    return new Response(JSON.stringify(updatedActivity), { status: 200 });
  } catch (error) {
    console.error("Error registering participant:", error);

    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(
      JSON.stringify({ message: "Failed to register participant", error: errMessage }),
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

    const errMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ message: "Failed to delete activity", error: errMessage }), { status: 500 });
  }
}
