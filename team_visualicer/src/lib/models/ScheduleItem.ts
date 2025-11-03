import { Schema, models, model } from "mongoose";

const ScheduleItemSchema = new Schema(
  {
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end:   { type: Date, required: true },
    audience: { type: String, enum: ["Todos","Investigadores","Posgrado","Servicio Social","Practicantes"], default: "Todos" },
    createdBy: { type: String }, // email o nombre
  },
  { timestamps: true }
);

export default models.ScheduleItem || model("ScheduleItem", ScheduleItemSchema);
