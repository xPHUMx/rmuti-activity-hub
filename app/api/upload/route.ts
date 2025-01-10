

// import { NextRequest, NextResponse } from "next/server";
// import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
// import connectToDatabase from "../../../utils/db";
// import Image from "../../../models/Image";

// connectToDatabase();

// // ตั้งค่า AWS S3 Client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     const title = formData.get("title") as string;

//     if (!file || !title) {
//       return NextResponse.json({ message: "File and title are required" }, { status: 400 });
//     }

//     const fileName = `${Date.now()}-${file.name}`;
//     const uploadParams = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: fileName,
//       Body: Buffer.from(await file.arrayBuffer()), // แปลงไฟล์เป็น Buffer
//       ContentType: file.type,
//     };

//     // อัปโหลดไฟล์ไปยัง S3
//     await s3.send(new PutObjectCommand(uploadParams));

//     const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

//     // บันทึกข้อมูลใน MongoDB
//     const newImage = await Image.create({
//       title,
//       url: s3Url,
//     });

//     return NextResponse.json(newImage, { status: 201 });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return NextResponse.json({ message: "Upload failed", error: error.message }, { status: 500 });
//   }
// }

// export async function GET() {
//   try {
//     const images = await Image.find({});
//     return NextResponse.json(images, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     return NextResponse.json({ message: "Failed to fetch images" }, { status: 500 });
//   }
// }

// // ฟังก์ชัน DELETE: ลบรูปภาพ
// export async function DELETE(req: NextRequest) {
//     try {
//       const { id } = await req.json();
  
//       if (!id) {
//         return NextResponse.json({ message: "Image ID is required" }, { status: 400 });
//       }
  
//       // ค้นหารูปภาพใน MongoDB
//       const image = await Image.findById(id);
//       if (!image) {
//         return NextResponse.json({ message: "Image not found in database" }, { status: 404 });
//       }
  
//       // ลบไฟล์ใน S3
//       const s3Key = image.url.split("/").pop(); // ดึง Key จาก URL
//       const deleteParams = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: s3Key,
//       };
  
//       await s3.send(new DeleteObjectCommand(deleteParams));
//       console.log(`File ${s3Key} deleted from S3`);
  
//       // ลบข้อมูลใน MongoDB
//       const deleteResult = await Image.deleteOne({ _id: id });
//       if (deleteResult.deletedCount === 0) {
//         return NextResponse.json({ message: "Failed to delete image from database" }, { status: 500 });
//       }
  
//       console.log(`Image ${id} deleted from database`);
  
//       return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
//     } catch (error) {
//       console.error("Error deleting image:", error);
//       return NextResponse.json({ message: "Failed to delete image", error: error.message }, { status: 500 });
//     }
//   }
  



import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import connectToDatabase from "../../../utils/db";
import Image from "../../../models/Image";

connectToDatabase();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// POST: อัปโหลดไฟล์
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file || !title) {
      return NextResponse.json({ message: "File and title are required" }, { status: 400 });
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

    const newImage = await Image.create({
      title,
      url: s3Url,
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Upload failed", error: errorMessage }, { status: 500 });
  }
}

// GET: ดึงรูปภาพทั้งหมด
export async function GET(req: NextRequest) {
  try {
    const images = await Image.find({});

    if (!images || images.length === 0) {
      return NextResponse.json({ message: "No images found" }, { status: 404 });
    }

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to fetch images", error: errorMessage }, { status: 500 });
  }
}

// DELETE: ลบไฟล์
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Image ID is required" }, { status: 400 });
    }

    const image = await Image.findById(id);
    if (!image) {
      return NextResponse.json({ message: "Image not found in database" }, { status: 404 });
    }

    const s3Key = image.url.split("/").pop();
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
    await Image.deleteOne({ _id: id });

    return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: "Failed to delete image", error: errorMessage }, { status: 500 });
  }
}
