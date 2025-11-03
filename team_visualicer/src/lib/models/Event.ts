import mongoose, { Schema, models } from "mongoose";

const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Event || mongoose.model("Event", EventSchema);
