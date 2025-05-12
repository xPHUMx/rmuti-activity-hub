

// import mongoose from "mongoose";

// // โครงสร้างของข้อมูลผู้ลงทะเบียน
// const ParticipantSchema = new mongoose.Schema({
//   fullName: { type: String, required: true }, // ชื่อ-นามสกุล
//   studentId: { type: String, required: true }, // รหัสนักศึกษา
//   year: { type: String, required: true }, // ชั้นปี
//   phone: { type: String, required: true }, // เบอร์โทร
//   registeredAt: { type: Date, default: Date.now }, // วันที่ลงทะเบียน
// });

// // โครงสร้างของกิจกรรม
// const ActivitySchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true }, // ชื่อกิจกรรม
//     description: { type: String, required: false }, // รายละเอียดกิจกรรม
//     image: { type: String, required: false }, // URL รูปภาพประกอบกิจกรรม
//     time: { type: Date, required: true }, // เวลาจัดกิจกรรม
//     closeTime: { type: Date, required: true }, // วันเวลาปิดลงทะเบียน
//     location: { type: String, required: true }, // สถานที่จัดกิจกรรม
//     participants: [ParticipantSchema], // เก็บข้อมูลผู้ลงทะเบียนในรูปแบบ Schema
//     maxParticipants: { type: Number, required: true, min: 1 }, // จำนวนผู้ลงทะเบียนสูงสุด
//     status: { type: String, enum: ["open", "closed"], default: "open" }, // สถานะกิจกรรม
//     updatedBy: { type: String, required: false }, // ผู้แก้ไขล่าสุด
//   },
//   { timestamps: true } // เพิ่ม createdAt และ updatedAt
// );

// // Middleware: อัปเดตสถานะกิจกรรมให้ปิดอัตโนมัติเมื่อเวลาลงทะเบียนสิ้นสุด
// ActivitySchema.pre("save", function (next) {
//   const now = new Date();
//   if (this.closeTime <= now) {
//     this.status = "closed";
//   }
//   next();
// });

// // Middleware: ตรวจสอบเวลาและสถานะก่อนบันทึก
// ActivitySchema.pre("validate", function (next) {
//   if (this.time >= this.closeTime) {
//     next(new Error("เวลาเริ่มกิจกรรมต้องน้อยกว่าวันเวลาปิดลงทะเบียน"));
//   } else {
//     next();
//   }
// });

// // Middleware: ตรวจสอบสถานะหลังการบันทึก
// ActivitySchema.post("save", function (doc, next) {
//   const now = new Date();
//   if (doc.closeTime <= now && doc.status === "open") {
//     doc.status = "closed";
//     doc.save();
//   }
//   next();
// });

// // Export โมเดล
// export default mongoose.models.Activity ||
//   mongoose.model("Activity", ActivitySchema);

// import mongoose from "mongoose";
// import connectToDatabase from "../utils/db";

// // เชื่อมต่อ MongoDB ก่อนสร้างโมเดล
// await connectToDatabase();

// // โครงสร้างของข้อมูลผู้ลงทะเบียน
// const ParticipantSchema = new mongoose.Schema({
//   fullName: { type: String, required: false },
//   studentId: { type: String, required: false },
//   department: { type: String, required: false },
//   year: { type: String, required: false },
//   phone: { type: String, required: false },
//   registeredAt: { type: Date, default: Date.now },
// });

// // โครงสร้างของกิจกรรม
// const ActivitySchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: false },
//     image: { type: String, required: false },
//     time: { type: Date, required: true },
//     closeTime: { type: Date, required: true },
//     location: { type: String, required: true },
//     participants: [ParticipantSchema],
//     maxParticipants: { type: Number, required: true, min: 1 },
//     status: { type: String, enum: ["open", "closed"], default: "open" },
//     updatedBy: { type: String, required: false },
//   },
//   { timestamps: true }
// );

// // เช็คว่ามีโมเดลอยู่แล้วหรือไม่
// const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

// export default Activity;





// import mongoose from "mongoose";
// import connectToDatabase from "../utils/db";

// // ฟังก์ชันเชื่อมต่อฐานข้อมูล
// const connect = async () => {
//   if (mongoose.connections[0].readyState) return; // ถ้าเชื่อมต่อแล้วไม่ต้องเชื่อมใหม่
//   await connectToDatabase();
// };

// // โครงสร้างของข้อมูลผู้ลงทะเบียน
// const ParticipantSchema = new mongoose.Schema({
//   fullName: { type: String, required: false },
//   studentId: { type: String, required: false },
//   department: { type: String, required: false },
//   year: { type: String, required: false },
//   phone: { type: String, required: false },
//   registeredAt: { type: Date, default: Date.now },
// });

// // โครงสร้างของกิจกรรม
// const ActivitySchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: false },
//     image: { type: String, required: false },
//     time: { type: Date, required: true },
//     closeTime: { type: Date, required: true },
//     location: { type: String, required: true },
//     participants: [ParticipantSchema],
//     maxParticipants: { type: Number, required: true, min: 1 },
//     status: { type: String, enum: ["open", "closed"], default: "open" },
//     updatedBy: { type: String, required: false },
//   },
//   { timestamps: true } // เพิ่ม timestamps ให้กับ createdAt และ updatedAt
// );

// // เช็คว่ามีโมเดลอยู่แล้วหรือไม่
// const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

// export default Activity;



import mongoose from "mongoose";
import connectToDatabase from "../utils/db";

// ฟังก์ชันเชื่อมต่อฐานข้อมูล
const connect = async () => {
  if (mongoose.connections[0].readyState) return; // ถ้าเชื่อมต่อแล้วไม่ต้องเชื่อมใหม่
  await connectToDatabase();
};

// โครงสร้างของข้อมูลผู้ลงทะเบียน
const ParticipantSchema = new mongoose.Schema({
  fullName: { type: String, required: false },
  studentId: { type: String, required: false },
  department: { type: String, required: false },
  program: { type: String, required: false }, 
  year: { type: String, required: false },
  phone: { type: String, required: false },
  registeredAt: { type: Date, default: Date.now },
});

// โครงสร้างของกิจกรรม
const ActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // ชื่อกิจกรรม
    newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News", required: false }, // ข่าวที่เกี่ยวข้อง
    registerStart: { type: Date, required: true }, // เวลาเปิดลงทะเบียน
    registerEnd: { type: Date, required: true },   // เวลาปิดลงทะเบียน
    activityStart: { type: Date, required: true }, // เวลาเริ่มกิจกรรมจริง
    activityEnd: { type: Date, required: true },   // เวลาสิ้นสุดกิจกรรมจริง
    location: { type: String, required: true }, // สถานที่
    participants: [ParticipantSchema], // รายชื่อผู้เข้าร่วม
    maxParticipants: { type: Number, required: true, min: 1 }, // จำนวนผู้เข้าร่วมสูงสุด
    status: { type: String, enum: ["open", "closed"], default: "open" }, // สถานะลงทะเบียน
    updatedBy: { type: String, required: false }, // คนแก้ไขล่าสุด (optional)
  },
  { timestamps: true } // มี createdAt และ updatedAt อัตโนมัติ
);

// เช็คว่ามีโมเดลอยู่แล้วหรือไม่
const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;
