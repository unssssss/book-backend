const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name must be less than 100 characters,"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "description must be less than 500 characters"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    color: {
      type: String,
      default: "#FFFFFF",
      match: [/^#([0-9A-F]{3}){1,2}$/i, "Invalid color format"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

CategorySchema.virtual("bookCount", {
  ref: "Book",
  localField: "_id",
  foreignField: "categoryId",
  count: true,
});

CategorySchema.pre("remove", async function (next) {
  const Book = mongoose.model("Book");
  const bookCount = await Book.countDocuments({ categoryId: this._id });

  if (bookCount > 0) {
    const error = new Error(
      `Cannot delete category. It contains ${bookCount} books`
    );
    return next(error);
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
