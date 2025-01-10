// import mongoose, { Schema, model, models } from "mongoose";

// const NewsSchema = new Schema(
//   {
//     title: { type: String, required: true },
//     image: { type: String, required: true }, // URL รูปภาพ
//     content: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const News = models.News || model("News", NewsSchema);
// export default News;


// models/News.ts


// models/News.ts
import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true }, // หัวข้อข่าวสาร
  image: { type: String, required: true }, // URL รูปภาพข่าวสาร
  content: { type: String, required: true }, // เนื้อหาข่าวสาร
  createdAt: { type: Date, default: Date.now }, // วันที่เพิ่มข่าวสาร
});

export default mongoose.models.News || mongoose.model("News", NewsSchema);
