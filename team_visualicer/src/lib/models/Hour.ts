import mongoose, { Schema, models } from "mongoose";

const HourSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  day: { type: Number, required: true },         // 1..6 (Sáb/Dom=6) o tu convención
  start: { type: String, required: true },       // "09:00"
  end: { type: String, required: true },         // "13:00"
  date: { type: Date },                          // opcional para rank por mes
  minutes: { type: Number, default: 0 }          // opcional: duración
}, { timestamps: true });

export default models.Hour || mongoose.model("Hour", HourSchema);
