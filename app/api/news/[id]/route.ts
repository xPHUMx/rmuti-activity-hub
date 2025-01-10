// import { NextRequest, NextResponse } from "next/server";
// import connectToDatabase from "../../../../utils/db";
// import News from "../../../../models/News";

// connectToDatabase();

// // ดึงรายละเอียดข่าวสาร
// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;
//     const news = await News.findById(id);

//     if (!news) {
//       return NextResponse.json({ message: "News not found" }, { status: 404 });
//     }

//     return NextResponse.json(news, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching news detail:", error);
//     return NextResponse.json({ message: "Failed to fetch news", error: error.message }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../../utils/db";
import News from "../../../../models/News";

// ฟังก์ชัน GET สำหรับดึงข่าวสารโดย ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectToDatabase();

  try {
    // ใช้ await เพื่อ unwrap ค่า params
    const { id } = await context.params;

    const newsItem = await News.findById(id);

    if (!newsItem) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json(newsItem, { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


