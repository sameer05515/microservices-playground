import mongoose, { Schema, Document } from "mongoose";

// Task interface
interface ITask extends Document {
  name: string;
  description: string;
  dueDate: Date;
  status: string; // e.g., "pending", "completed"
}

// Task Schema
const taskSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  //   status: { type: String, required: true, default: "pending" },
  status: {
    type: String,
    enum: ["open", "in-progress", "on-hold", "closed"],
    required: true,
    default: "open"
  },
});

const TaskModel = mongoose.model<ITask>("Task", taskSchema);

export default TaskModel;
