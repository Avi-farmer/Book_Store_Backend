import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import orderRoute from "./route/order.route.js"; // Added order route import

dotenv.config(); // FIXED: function call

const app = express();
const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

app.use(express.json());
app.use(cors());

try {
  await mongoose.connect(URI);
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.error("❌ MongoDB connection error:", error.message);
  process.exit(1);
}

// Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute); // Added order route

app.get("/", (req, res) => {
  res.json({ activeStatus: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
