import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  title: string;
  completed: boolean;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

TaskSchema.index({ userId: 1 });
TaskSchema.index({ completed: 1 });

export default mongoose.model<ITask>("Task", TaskSchema);
