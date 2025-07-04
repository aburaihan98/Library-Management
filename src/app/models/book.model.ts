import mongoose, { Model, Schema } from "mongoose";
import {
  BookInstanceMethods,
  IBookInterface,
} from "../interfaces/book.interface";

const bookSchema = new Schema<IBookInterface>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    copies: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.methods.decreaseCopies = async function (quantity: number) {
  this.copies -= quantity;
  if (this.copies <= 0) {
    this.available = false;
  }
  await this.save();
};

export const Book = mongoose.model<
  IBookInterface,
  Model<IBookInterface, Record<string, unknown>, BookInstanceMethods>
>("Book", bookSchema);
