import { Schema, models, model } from "mongoose";

const GalleryItemSchema = new Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default models.GalleryItem || model("GalleryItem", GalleryItemSchema);
