import mongoose, { Schema } from "mongoose";
import { IBorrow } from "../interfaces/borro.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "At least one copy must be borrowed"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Borrow = mongoose.model<IBorrow>("Borrow", borrowSchema);
