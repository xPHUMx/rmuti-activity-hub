import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";

connectToDatabase();

export async function GET(req: Request) {
  try {
    const totalUsers = await User.countDocuments(); // จำนวนผู้ใช้ทั้งหมด
    const onlineUsers = await User.countDocuments({ isOnline: true }); // จำนวนผู้ใช้ออนไลน์

    return new Response(
      JSON.stringify({ totalUsers, onlineUsers }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch user data", error }),
      { status: 500 }
    );
  }
}
