

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


import mongoose from "mongoose";

// โครงสร้างของข้อมูลผู้ลงทะเบียน
const ParticipantSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // ชื่อ-นามสกุล
  studentId: { type: String, required: true }, // รหัสนักศึกษา
  year: { type: String, required: true }, // ชั้นปี
  phone: { type: String, required: true }, // เบอร์โทร
  registeredAt: { type: Date, default: Date.now }, // วันที่ลงทะเบียน
});

// โครงสร้างของกิจกรรม
const ActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // ชื่อกิจกรรม
    description: { type: String, required: false }, // รายละเอียดกิจกรรม
    image: { type: String, required: false }, // URL รูปภาพประกอบกิจกรรม
    time: { type: Date, required: true }, // เวลาจัดกิจกรรม
    closeTime: { type: Date, required: true }, // วันเวลาปิดลงทะเบียน
    location: { type: String, required: true }, // สถานที่จัดกิจกรรม
    participants: [ParticipantSchema], // เก็บข้อมูลผู้ลงทะเบียนในรูปแบบ Schema
    maxParticipants: { type: Number, required: true, min: 1 }, // จำนวนผู้ลงทะเบียนสูงสุด
    status: { type: String, enum: ["open", "closed"], default: "open" }, // สถานะกิจกรรม
    updatedBy: { type: String, required: false }, // ผู้แก้ไขล่าสุด
  },
  { timestamps: true } // เพิ่ม createdAt และ updatedAt
);

// Middleware: อัปเดตสถานะกิจกรรมให้ปิดอัตโนมัติเมื่อเวลาลงทะเบียนสิ้นสุด
ActivitySchema.pre("save", function (next) {
  const now = new Date();
  if (this.closeTime <= now) {
    this.status = "closed";
  }
  next();
});

// Middleware: ตรวจสอบเวลาและสถานะก่อนบันทึก
ActivitySchema.pre("validate", function (next) {
  if (this.time >= this.closeTime) {
    next(new Error("เวลาเริ่มกิจกรรมต้องน้อยกว่าวันเวลาปิดลงทะเบียน"));
  } else {
    next();
  }
});

// Middleware: ตรวจสอบสถานะหลังการบันทึก
ActivitySchema.post("save", function (doc, next) {
  const now = new Date();
  if (doc.closeTime <= now && doc.status === "open") {
    doc.status = "closed";
    doc.save();
  }
  next();
});

// Export โมเดล
export default mongoose.models.Activity ||
  mongoose.model("Activity", ActivitySchema);



