import express, { Request, Response } from "express";
import { Book } from "../models/book.model";

export const bookRoutes = express.Router();

// crate book

bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
