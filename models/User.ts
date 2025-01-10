// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   isOnline: { type: Boolean, default: false },
//   role: { type: String, default: "user" }, // 'user' หรือ 'admin'
//   registeredActivities: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
//   ],
// });

// export default mongoose.models.User || mongoose.model("User", UserSchema);

// import mongoose from "mongoose";

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
//   registeredActivities: [
//     {
//       activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }, // กิจกรรมที่ลงทะเบียน
//       registrationDate: { type: Date, default: Date.now }, // วันที่ลงทะเบียน
//     },
//   ],
//   createdAt: { type: Date, default: Date.now }, // วันที่สร้างบัญชี
//   updatedAt: { type: Date, default: Date.now }, // วันที่อัปเดตข้อมูล
// });

// // Hook สำหรับอัปเดตวันที่อัตโนมัติ
// UserSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// export default mongoose.models.User || mongoose.model("User", UserSchema);

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
//   this.updatedAt = Date.now();
//   next();
// });

// // Static Method สำหรับเพิ่มกิจกรรมที่ลงทะเบียน
// UserSchema.statics.addRegisteredActivity = async function (userId, activityId) {
//   const user = await this.findById(userId);
//   if (!user) throw new Error("User not found");

//   const activity = await Activity.findById(activityId);
//   if (!activity) throw new Error("Activity not found");

//   const alreadyRegistered = user.registeredActivities.some(
//     (activity) => activity.activityId.toString() === activityId.toString()
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
// UserSchema.methods.hasRegisteredActivity = function (activityId) {
//   return this.registeredActivities.some(
//     (activity) => activity.activityId.toString() === activityId.toString()
//   );
// };

// export default mongoose.models.User || mongoose.model("User", UserSchema);


import mongoose from "mongoose";
import Activity from "./Activity"; // เชื่อมกับโมเดล Activity

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: "" }, // รูปโปรไฟล์ผู้ใช้
  isOnline: { type: Boolean, default: false }, // สถานะออนไลน์
  role: {
    type: String,
    enum: ["user", "admin"], // จำกัดบทบาทให้เป็น 'user' หรือ 'admin'
    default: "user",
  },
  registeredActivities: {
    type: [
      {
        activityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Activity",
          required: true,
        }, // กิจกรรมที่ลงทะเบียน
        registrationDate: { type: Date, default: Date.now }, // วันที่ลงทะเบียน
      },
    ],
    default: [], // ค่าเริ่มต้นเป็นอาร์เรย์ว่าง
  },
  createdAt: { type: Date, default: Date.now }, // วันที่สร้างบัญชี
  updatedAt: { type: Date, default: Date.now }, // วันที่อัปเดตข้อมูล
});

// Hook สำหรับอัปเดตวันที่อัตโนมัติ
UserSchema.pre("save", function (next) {
  this.updatedAt = new Date(); // แปลงเป็น Date แทนที่จะเป็น timestamp
  next();
});

// Static Method สำหรับเพิ่มกิจกรรมที่ลงทะเบียน
UserSchema.statics.addRegisteredActivity = async function (userId: string, activityId: mongoose.Types.ObjectId) {
  const user = await this.findById(userId);
  if (!user) throw new Error("User not found");

  const activity = await Activity.findById(activityId);
  if (!activity) throw new Error("Activity not found");

  const alreadyRegistered = user.registeredActivities.some(
    (activity: { activityId: mongoose.Types.ObjectId }) =>
      activity.activityId.toString() === activityId.toString()
  );

  if (alreadyRegistered) {
    throw new Error("Activity already registered");
  }

  user.registeredActivities.push({ activityId });
  await user.save();
  return user;
};

// Static Method สำหรับดึงกิจกรรมที่ผู้ใช้ลงทะเบียน
UserSchema.statics.getRegisteredActivities = async function (userId) {
  const user = await this.findById(userId).populate("registeredActivities.activityId");
  if (!user) throw new Error("User not found");
  return user.registeredActivities;
};

// Instance Method สำหรับตรวจสอบว่าผู้ใช้ลงทะเบียนกิจกรรมนี้หรือยัง
UserSchema.methods.hasRegisteredActivity = function (
  activityId: mongoose.Types.ObjectId | string
): boolean {
  return this.registeredActivities.some(
    (activity: { activityId: mongoose.Types.ObjectId }) =>
      activity.activityId.toString() === activityId.toString()
  );
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
