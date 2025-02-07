import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string; // Role assigned to the user (e.g., 'admin', 'user', 'moderator')
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    role: { type: String, required: true, enum: ["admin", "user", "moderator"] },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("UserV3", UserSchema);
