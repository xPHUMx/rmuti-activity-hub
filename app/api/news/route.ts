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
//     return NextResponse.json({ message: "Failed to fetch news", error: error.message }, { status: 500 });
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
//     return NextResponse.json({ message: "Failed to create news", error: error.message }, { status: 500 });
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
//     return NextResponse.json({ message: "Failed to delete news", error: error.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import connectToDatabase from "../../../utils/db";
import News from "../../../models/News";

connectToDatabase();

// ตั้งค่า AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// GET: ดึงข่าวสารทั้งหมด
export async function GET() {
  try {
    const news = await News.find({});
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to fetch news", error: errorMessage }, { status: 500 });
  }
}

// POST: เพิ่มข่าวสาร
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

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

    // อัปโหลดไฟล์ไปยัง S3
    await s3.send(new PutObjectCommand(uploadParams));

    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // บันทึกข้อมูลใน MongoDB
    const newNews = await News.create({
      title,
      image: s3Url,
      content,
    });

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to create news", error: errorMessage }, { status: 500 });
  }
}

// DELETE: ลบข่าวสาร
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

    // ลบไฟล์ใน S3
    const s3Key = news.image.split("/").pop();
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    // ลบข้อมูลใน MongoDB
    await News.deleteOne({ _id: id });

    return NextResponse.json({ message: "News deleted successfully" }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to delete news", error: errorMessage }, { status: 500 });
  }
}
