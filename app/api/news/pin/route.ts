import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/db";
import News from "@/models/News";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Missing ID in request" },
        { status: 400 }
      );
    }

    const newsItem = await News.findById(id);
    if (!newsItem) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }

    // Toggle pinned status
    newsItem.pinned = !newsItem.pinned;
    await newsItem.save();

    return NextResponse.json({
      message: `News ${newsItem.pinned ? "pinned" : "unpinned"} successfully`,
      pinned: newsItem.pinned,
    });
  } catch (error) {
    console.error("❌ Error in PATCH /api/news/pin:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
