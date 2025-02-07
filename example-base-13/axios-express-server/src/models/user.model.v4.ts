import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: string[]; // 🔥 User can now have multiple roles
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], required: true, default: ["user"] }, // Default to 'user' role
});

const User = mongoose.model<IUser>("UserV4", UserSchema);
export {User};
