import { Schema, models, model } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    author: { type: String, default: "Administrador" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Announcement || model("Announcement", AnnouncementSchema);
