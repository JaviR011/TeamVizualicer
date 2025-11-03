import { Schema, models, model } from "mongoose";

export interface ILabSchedule {
  userEmail: string;
  userName: string;
  day: number;      // 0=Lun ... 6=Dom
  start: string;    // "09:00"
  end: string;      // "13:00"
  createdBy?: string;
}

const LabScheduleSchema = new Schema<ILabSchedule>(
  {
    userEmail: { type: String, required: true, index: true },
    userName:  { type: String, required: true },
    day:       { type: Number, min: 0, max: 6, required: true, index: true },
    start:     { type: String, required: true },
    end:       { type: String, required: true },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default models.LabSchedule || model<ILabSchedule>("LabSchedule", LabScheduleSchema);
