const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Category = require("../models/Category");
const auth = require("../middleware/auth");

//get all books
router.get("/", auth, async (req, res) => {
  try {
    console.log("getting books for user:", req.user.id);

    const books = await Book.find({ userId: req.user.id })
      .populate("categoryId", "name color")
      .sort({
        name: 1,
      });

    console.log(`Found ${books.length} books`);

    res.json({
      success: true,
      books: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

//get book by id
router.get("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("categoryId", "name color");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    res.json({
      success: true,
      book: book,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, description, categoryId, quantity } = req.body;

    if (!name || !categoryId || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingBook = await Book.findOne({
      name,
      userId: req.user.id,
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book with this name already exists",
      });
    }

    const bookData = new Book({
      name: name.trim(),
      description: description ? description.trim() : "",
      categoryId,
      userId: req.user.id,
      quantity,
    });

    console.log("Book data to be saved:", bookData);
    await bookData.save();

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: {
        ...bookData.toObject(),
        category: null,
      },
    });
  } catch (error) {
    console.error("erroe creating book:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "validation error",
        errors: errors,
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Book with this name already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    console.log("updating book for user:", req.user.id);

    const { name, description, categoryId, quantity } = req.body;

    const book = await Book.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "book not found",
      });
    }

    if (name && name.trim() !== book.name) {
      const existingBook = await Book.findOne({
        name: name.trim(),
        userId: req.user.id,
        _id: { $ne: req.params.id },
      });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          message: "book with this name already exists",
        });
      }
    }
    if (name !== undefined) book.name = name.trim();
    if (description !== undefined) book.description = description.trim();
    if (categoryId !== undefined) book.categoryId = categoryId;
    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity cannot be negative",
        });
      }
      book.quantity = Number(quantity);
    }

    await book.save();

    //pupulate category info before sending response
    await book.populate("categoryId", "name color");

    console.log("book updated", book);

    res.json({
      success: true,
      message: "book updated successfully",
      book: book,
    });
  } catch (error) {
    console.error("error updating book:", error);

    if (error.name == "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error while updating book",
      error: error.message,
    });
  }
});

//delete book
router.delete("/:id", auth, async (req, res) => {
  try {
    console.log("deleting book for user:", req.user.id);

    const book = await Book.findById({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "book not found",
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    console.log("book deleted:", req.params.id);

    res.json({
      success: true,
      message: "book deleted successfully",
    });
  } catch (error) {
    console.error("error deleting book:", error);
    res.status(500).json({
      success: false,
      message: "server error while deleting book",
      error: error.message,
    });
  }
});

module.exports = router;
