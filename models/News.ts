

// // models/News.ts
// import mongoose from "mongoose";

// const NewsSchema = new mongoose.Schema({
//   title: { type: String, required: true }, // หัวข้อข่าวสาร
//   image: { type: String, required: true }, // URL รูปภาพข่าวสาร
//   content: { type: String, required: true }, // เนื้อหาข่าวสาร
//   createdAt: { type: Date, default: Date.now }, // วันที่เพิ่มข่าวสาร
// });

// export default mongoose.models.News || mongoose.model("News", NewsSchema);

import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  pinned: { type: Boolean, default: false }, // ✅ เพิ่ม field pinned
  createdAt: { type: Date, default: Date.now }, // ✅ createdAt ตอนเพิ่มข่าว
});

export default mongoose.models.News || mongoose.model("News", NewsSchema);
