
// import { NextRequest, NextResponse } from "next/server";
// import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import connectToDatabase from "../../../utils/db";
// import News from "../../../models/News";

// connectToDatabase();

// // ตั้งค่า AWS S3 Client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// // GET: ดึงข่าวสารทั้งหมด
// export async function GET() {
//   try {
//     const news = await News.find({});
//     return NextResponse.json(news, { status: 200 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ message: "Failed to fetch news", error: errorMessage }, { status: 500 });
//   }
// }

// // POST: เพิ่มข่าวสาร
// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     const title = formData.get("title") as string;
//     const content = formData.get("content") as string;

//     if (!file || !title || !content) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const fileName = `${Date.now()}-${file.name}`;
//     const uploadParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: fileName,
//       Body: Buffer.from(await file.arrayBuffer()),
//       ContentType: file.type,
//     };

//     // อัปโหลดไฟล์ไปยัง S3
//     await s3.send(new PutObjectCommand(uploadParams));

//     const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

//     // บันทึกข้อมูลใน MongoDB
//     const newNews = await News.create({
//       title,
//       image: s3Url,
//       content,
//     });

//     return NextResponse.json(newNews, { status: 201 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ message: "Failed to create news", error: errorMessage }, { status: 500 });
//   }
// }

// // DELETE: ลบข่าวสาร
// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json({ message: "News ID is required" }, { status: 400 });
//     }

//     const news = await News.findById(id);
//     if (!news) {
//       return NextResponse.json({ message: "News not found" }, { status: 404 });
//     }

//     // ลบไฟล์ใน S3
//     const s3Key = news.image.split("/").pop();
//     const deleteParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: s3Key,
//     };

//     await s3.send(new DeleteObjectCommand(deleteParams));

//     // ลบข้อมูลใน MongoDB
//     await News.deleteOne({ _id: id });

//     return NextResponse.json({ message: "News deleted successfully" }, { status: 200 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ message: "Failed to delete news", error: errorMessage }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import connectToDatabase from "@/utils/db";
// import News from "@/models/News";

// connectToDatabase();

// // ตั้งค่า AWS S3 Client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// // ✅ GET: ดึงข่าวทั้งหมด แบบเรียง ปักหมุดก่อน
// export async function GET() {
//   try {
//     const news = await News.find({}).sort({ pinned: -1, createdAt: -1 }); 
//     // pinned ก่อน (1 = true บน), แล้วตาม createdAt ใหม่สุด

//     return NextResponse.json(news, { status: 200 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ message: "Failed to fetch news", error: errorMessage }, { status: 500 });
//   }
// }

// // ✅ POST: เพิ่มข่าวสาร พร้อมเซฟ pinned ด้วย
// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     const title = formData.get("title") as string;
//     const content = formData.get("content") as string;
//     const pinnedString = formData.get("pinned") as string; // 🆕 ดึง pinned มาด้วย
//     const pinned = pinnedString ? JSON.parse(pinnedString) : false; // parse เป็น boolean

//     if (!file || !title || !content) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const fileName = `${Date.now()}-${file.name}`;
//     const uploadParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: fileName,
//       Body: Buffer.from(await file.arrayBuffer()),
//       ContentType: file.type,
//     };

//     await s3.send(new PutObjectCommand(uploadParams));

//     const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

//     // ✅ ตอนบันทึก MongoDB ต้องมี pinned ด้วย
//     const newNews = await News.create({
//       title,
//       image: s3Url,
//       content,
//       pinned,
//     });

//     return NextResponse.json(newNews, { status: 201 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ message: "Failed to create news", error: errorMessage }, { status: 500 });
//   }
// }

// // ✅ DELETE: ลบข่าว
// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json({ message: "News ID is required" }, { status: 400 });
//     }

//     const news = await News.findById(id);
//     if (!news) {
//       return NextResponse.json({ message: "News not found" }, { status: 404 });
//     }

//     const s3Key = news.image.split("/").pop();
//     const deleteParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: s3Key,
//     };

//     await s3.send(new DeleteObjectCommand(deleteParams));

//     await News.deleteOne({ _id: id });

//     return NextResponse.json({ message: "News deleted successfully" }, { status: 200 });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json({ message: "Failed to delete news", error: errorMessage }, { status: 500 });
//   }
// }

// app/api/news/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import connectToDatabase from "@/utils/db";
import News from "@/models/News";

connectToDatabase();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ✅ GET: ดึงข่าวทั้งหมด (เรียง: ปักหมุดก่อน)
export async function GET() {
  try {
    const news = await News.find({}).sort({ pinned: -1, createdAt: -1 });
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to fetch news", error: errorMessage }, { status: 500 });
  }
}

// ✅ POST: เพิ่มข่าวใหม่
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const pinnedString = formData.get("pinned") as string;
    const pinned = pinnedString ? JSON.parse(pinnedString) : false;

    if (!file || !title || !content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const newNews = await News.create({
      title,
      image: s3Url,
      content,
      pinned,
    });

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to create news", error: errorMessage }, { status: 500 });
  }
}

// ✅ PATCH: แก้ไขข่าว
export async function PATCH(req: NextRequest) {
  try {
    const { id, title, content, pinned } = await req.json();

    if (!id || !title || !content) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    news.title = title;
    news.content = content;
    news.pinned = pinned ?? news.pinned;
    await news.save();

    return NextResponse.json({ message: "News updated successfully" }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to update news", error: errorMessage }, { status: 500 });
  }
}

// ✅ DELETE: ลบข่าว
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "News ID is required" }, { status: 400 });
    }

    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    const s3Key = news.image.split("/").pop();
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    await News.deleteOne({ _id: id });

    return NextResponse.json({ message: "News deleted successfully" }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to delete news", error: errorMessage }, { status: 500 });
  }
}
