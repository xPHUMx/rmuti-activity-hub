import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema({
  imageUrl: String,
  order: Number,
});

export default mongoose.models.Carousel || mongoose.model("Carousel", CarouselSchema);
