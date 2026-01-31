const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Book = require("../models/Book");
const Category = require("../models/Category");
const auth = require("../middleware/auth");

/////////////////////////////////////////////////////////////REGISTER/////////////////////////////////
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "user already exists" });
    }

    user = new User({
      username,
      password,
    });

    await user.save();
    console.log("User saved successfully:", user.username);

    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (error) {
    console.log("Registration error:", error.message);
    res.status(500).send("server error");
  }
});

//////////////////////////////////////////LOGIN/////////////////////////////////////////
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "invalid credentials" });
    }

    const payload = {
      id: user.id,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("server error");
  }
});

// Delete user account
router.delete("/me", auth, async (req, res) => {
  try {
    console.log("Deleting user:", req.user.id);

    // Delete all user's books
    await Book.deleteMany({ userId: req.user.id });
    console.log("Deleted user's books");

    // Delete all user's categories
    await Category.deleteMany({ userId: req.user.id });
    console.log("Deleted user's categories");

    // Delete the user
    await User.findByIdAndDelete(req.user.id);
    console.log("User deleted successfully");

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting account",
      error: error.message,
    });
  }
});

module.exports = router;
