import mongoose, { Schema } from "mongoose";

const borrowSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Library",
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

export const Borrow = mongoose.model("Borrow", borrowSchema);
