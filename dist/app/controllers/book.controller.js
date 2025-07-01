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
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const mongodb_1 = require("mongodb");
exports.bookRoutes = express_1.default.Router();
// Create Book
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const newBook = yield book_model_1.Book.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: newBook,
        });
    }
    catch (error) {
        // Duplicate key error
        if (error.code === 11000 && ((_a = error.keyPattern) === null || _a === void 0 ? void 0 : _a.isbn)) {
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
                            value: (_b = error.keyValue) === null || _b === void 0 ? void 0 : _b.isbn,
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
}));
// Get All Books
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
        let query = {};
        if (filter) {
            query.genre = filter;
        }
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sort === "desc" ? -1 : 1 })
            .limit(parseInt(limit));
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
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
//Get Book by ID
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const books = yield book_model_1.Book.find({ _id: new mongodb_1.ObjectId(id) });
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: books,
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
// Update Book
exports.bookRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const updatedDoc = req.body;
        const books = yield book_model_1.Book.findByIdAndUpdate({ _id: new mongodb_1.ObjectId(id) }, updatedDoc, { new: true });
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: books,
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
// Delete Book
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const books = yield book_model_1.Book.findByIdAndDelete({ _id: new mongodb_1.ObjectId(id) }, { new: true });
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
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
