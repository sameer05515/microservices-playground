import mongoose, { Document, Schema } from "mongoose";

// Define TypeScript interface
export interface IItem extends Document {
  name: string;
  category: string;
  price: number;
}

// Define Mongoose Schema
const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
});

// Create and export Model
export const ItemModel = mongoose.model<IItem>("Item", ItemSchema);
