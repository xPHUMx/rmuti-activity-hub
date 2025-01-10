// import mongoose from "mongoose";

// const ImageSchema = new mongoose.Schema({
//   url: { type: String, required: true }, // URL ของรูปภาพ
//   caption: { type: String, required: false }, // คำอธิบายภาพ
// });

// export default mongoose.models.Image || mongoose.model("Image", ImageSchema);

// models/Image.ts

import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
