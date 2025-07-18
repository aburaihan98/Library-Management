import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { ObjectId } from "mongodb";
import { z } from "zod";

export const bookRoutes = express.Router();

// zod validation
const createBookSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  author: z.string({ required_error: "Author is required" }),
  genre: z.enum(
    ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    { required_error: "Genre is required" }
  ),
  isbn: z.string({ required_error: "ISBN is required" }),
  description: z.string().optional(),
  copies: z
    .number({ required_error: "Copies is required" })
    .min(0, { message: "Copies must be a non-negative number" }),
  available: z.boolean().optional(),
});

// Create Book
bookRoutes.post(
  "/create-book",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const zodBody = createBookSchema.safeParse(req.body);

      if (!zodBody.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          error: zodBody.error.format(),
        });
      }

      const newBook = await Book.create(zodBody.data);
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
  }
);
// Get All Books
bookRoutes.get("/books", async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
    } = req.query;

    const query: Record<string, any> = {};
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
//Get Book by ID
bookRoutes.get(
  "/books/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;

      const books = await Book.find({ _id: new ObjectId(id) });

      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: books,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
);
// Update Book
bookRoutes.put(
  "/edit-book/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const updatedDoc = req.body;

      console.log(id, updatedDoc);

      const books = await Book.findByIdAndUpdate(
        { _id: new ObjectId(id) },
        updatedDoc,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: books,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
);
// Delete Book
bookRoutes.delete(
  "/:bookId",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.bookId;

      const books = await Book.findByIdAndDelete(
        { _id: new ObjectId(id) },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
);
