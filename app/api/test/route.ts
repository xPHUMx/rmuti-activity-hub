import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";

export async function GET(req: Request) {
  await connectToDatabase();
  const users = await User.find({});
  return new Response(JSON.stringify(users), { status: 200 });
}
