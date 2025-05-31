import express from "express";
import { getBook, addBook, deleteBook, updateBook } from "../controller/book.controller.js";

const router = express.Router();

router.get("/", getBook);               // GET all books
router.post("/", addBook);              // ADD a new book
router.delete("/:id", deleteBook);      // DELETE a book by ID
router.put("/:id", updateBook);         // UPDATE a book by ID

export default router;
