import express, { Request, Response } from "express";
import { Book } from "../models/book.model";

export const bookRoutes = express.Router();

// Create Book
bookRoutes.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error: any) {
    // Duplicate key error
    if (error.code === 11000 && error.keyPattern?.isbn) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: {
          name: "ValidationError",
          errors: {
            isbn: {
              message: "Book with this ISBN already exists",
              name: error.name,
              kind: "duplicate",
              path: "isbn",
              value: error.keyValue?.isbn,
            },
          },
        },
      });
    }

    // Mongoose ValidationError (e.g., invalid copies)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error,
      });
    }

    // Any other errors
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});
// Get All Books
bookRoutes.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    let query: Record<string, any> = {};
    if (filter) {
      query.genre = filter;
    }

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === "desc" ? -1 : 1 })
      .limit(parseInt(limit as string));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});
