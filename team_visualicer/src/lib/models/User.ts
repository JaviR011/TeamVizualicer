  import mongoose, { Schema, Model } from "mongoose";

  export type MemberType = "investigador" | "posgrado" | "practicante" | "servicio-social";

  export interface IUser {
    name: string;
    career: string;
    memberType: MemberType;
    email: string;
    passwordHash: string;
    isAdmin: boolean;
    serviceHours: number;
  }

  const UserSchema = new Schema<IUser>(
    {
      name: { type: String, required: true, trim: true },
      career: { type: String, required: true, trim: true },
      memberType: {
        type: String,
        enum: ["investigador", "posgrado", "practicante", "servicio-social"],
        required: true,
      },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      passwordHash: { type: String, required: true },
      isAdmin: { type: Boolean, default: false },
      serviceHours: { type: Number, default: 0 },
    },
    { timestamps: true }
  );

  export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
