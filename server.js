const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

//////////////////////////////////////////////MIDDLEWARE///////////////////////////////////////////////
app.use(cors());
app.use(express.json());

///////////////////////////////////////// MONGODB CONNECTION //////////////////////////////////////////
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

/////////////////////////////////////////// ROUTES ////////////////////////////////////////////////////
const userRoutes = require("./routes/users");
const categories = require("./routes/categories");
const books = require("./routes/books");

app.use("/api/users", userRoutes);
app.use("/api/categories", categories);
app.use("/api/books", books);

app.get("/", (req, res) => {
  res.json({
    message: "server is running",
    status: "ok",
    timestamp: new Date(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
