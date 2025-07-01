"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
const book_model_1 = require("../models/book.model");
exports.borrowRoutes = express_1.default.Router();
// Create Book
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        const foundBook = yield book_model_1.Book.findById(book);
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
        yield foundBook.save();
        // Borrow record save
        const borrowRecord = yield borrow_model_1.Borrow.create({ book, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowRecord,
        });
    }
    catch (error) {
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
}));
// Borrowed Books Summary (Using Aggregation)
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            { $unwind: "$bookInfo" },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
}));
