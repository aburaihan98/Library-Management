import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
import { Book } from "../models/book.model";

export const borrowRoutes = express.Router();

// Create Book
borrowRoutes.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { book, quantity, dueDate } = req.body;

    const foundBook = await Book.findById(book);
    if (!foundBook) {
      return res.status(404).json({
        success: false,
        message: "Validation failed",
        error: {
          name: "ValidationError",
          errors: {
            book: {
              message: "Book not found",
              name: "ValidatorError",
              kind: "notFound",
              path: "book",
              value: book,
            },
          },
        },
      });
    }

    // Copies check
    if (foundBook.copies < quantity) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: {
          name: "ValidationError",
          errors: {
            quantity: {
              message: "Not enough copies available",
              name: "ValidatorError",
              kind: "min",
              path: "quantity",
              value: quantity,
            },
          },
        },
      });
    }

    // Update book copies and availability
    foundBook.copies -= quantity;
    if (foundBook.copies === 0) {
      foundBook.available = false;
    }
    await foundBook.save();

    // Borrow record save
    const borrowRecord = await Borrow.create({ book, quantity, dueDate });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        error: error,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});
