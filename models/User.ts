


// import mongoose from "mongoose";
// import Activity from "./Activity"; // เชื่อมกับโมเดล Activity

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   image: { type: String, default: "" }, // รูปโปรไฟล์ผู้ใช้
//   isOnline: { type: Boolean, default: false }, // สถานะออนไลน์
//   role: {
//     type: String,
//     enum: ["user", "admin"], // จำกัดบทบาทให้เป็น 'user' หรือ 'admin'
//     default: "user",
//   },
//   studentId: { type: String, default: "" }, // ✅ รหัสนักศึกษา
//   department: { type: String, default: null }, // ✅ สาขาวิชา
//   year: { type: String, default: null }, // ✅ ปีการศึกษา
//   phone: { type: String, default: null }, // ✅ เบอร์โทรศัพท์
//   registeredActivities: {
//     type: [
//       {
//         activityId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Activity",
//           required: true,
//         }, // กิจกรรมที่ลงทะเบียน
//         registrationDate: { type: Date, default: Date.now }, // วันที่ลงทะเบียน
//       },
//     ],
//     default: [], // ค่าเริ่มต้นเป็นอาร์เรย์ว่าง
//   },
//   createdAt: { type: Date, default: Date.now }, // วันที่สร้างบัญชี
//   updatedAt: { type: Date, default: Date.now }, // วันที่อัปเดตข้อมูล
// });

// // Hook สำหรับอัปเดตวันที่อัตโนมัติ
// UserSchema.pre("save", function (next) {
//   this.updatedAt = new Date(); // อัปเดต timestamp ทุกครั้งที่มีการบันทึก
//   next();
// });

// // Static Method สำหรับเพิ่มกิจกรรมที่ลงทะเบียน
// UserSchema.statics.addRegisteredActivity = async function (userId: string, activityId: mongoose.Types.ObjectId) {
//   const user = await this.findById(userId);
//   if (!user) throw new Error("User not found");

//   const activity = await Activity.findById(activityId);
//   if (!activity) throw new Error("Activity not found");

//   const alreadyRegistered = user.registeredActivities.some(
//     (activity: { activityId: mongoose.Types.ObjectId }) =>
//       activity.activityId.toString() === activityId.toString()
//   );

//   if (alreadyRegistered) {
//     throw new Error("Activity already registered");
//   }

//   user.registeredActivities.push({ activityId });
//   await user.save();
//   return user;
// };

// // Static Method สำหรับดึงกิจกรรมที่ผู้ใช้ลงทะเบียน
// UserSchema.statics.getRegisteredActivities = async function (userId) {
//   const user = await this.findById(userId).populate("registeredActivities.activityId");
//   if (!user) throw new Error("User not found");
//   return user.registeredActivities;
// };

// // Instance Method สำหรับตรวจสอบว่าผู้ใช้ลงทะเบียนกิจกรรมนี้หรือยัง
// UserSchema.methods.hasRegisteredActivity = function (
//   activityId: mongoose.Types.ObjectId | string
// ): boolean {
//   return this.registeredActivities.some(
//     (activity: { activityId: mongoose.Types.ObjectId }) =>
//       activity.activityId.toString() === activityId.toString()
//   );
// };

// export default mongoose.models.User || mongoose.model("User", UserSchema);


import mongoose from "mongoose";
import Activity from "./Activity"; // เชื่อมกับโมเดล Activity

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  isOnline: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  // ---------------- ข้อมูลนักศึกษา ----------------
  studentId: { type: String, default: "" },
  department: { type: String, default: null },
  program: {  // ✅ เพิ่มภาค
    type: String,
    enum: ["ภาคปกติ", "ภาคสมทบ"],
    default: "ภาคปกติ",
  },
  year: { type: String, default: null },
  phone: { type: String, default: null },

  // ---------------- ข้อมูลกิจกรรม ----------------
  registeredActivities: {
    type: [
      {
        activityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Activity",
          required: true,
        },
        registrationDate: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hook สำหรับอัปเดต updatedAt อัตโนมัติ
UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Static Method: ลงทะเบียนกิจกรรม
UserSchema.statics.addRegisteredActivity = async function (
  userId: string,
  activityId: mongoose.Types.ObjectId
) {
  const user = await this.findById(userId);
  if (!user) throw new Error("User not found");

  const activity = await Activity.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  const alreadyRegistered = user.registeredActivities.some(
    (a: { activityId: mongoose.Types.ObjectId }) =>
      a.activityId.toString() === activityId.toString()
  );

  if (alreadyRegistered) {
    throw new Error("Activity already registered");
  }

  user.registeredActivities.push({ activityId });
  await user.save();
  return user;
};

// Static Method: ดึงกิจกรรมที่ลงทะเบียน
UserSchema.statics.getRegisteredActivities = async function (userId: string) {
  const user = await this.findById(userId).populate("registeredActivities.activityId");
  if (!user) throw new Error("User not found");
  return user.registeredActivities;
};

// Instance Method: เช็กว่าลงทะเบียนกิจกรรมนี้หรือยัง
UserSchema.methods.hasRegisteredActivity = function (
  activityId: mongoose.Types.ObjectId | string
): boolean {
  return this.registeredActivities.some(
    (a: { activityId: mongoose.Types.ObjectId }) =>
      a.activityId.toString() === activityId.toString()
  );
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
