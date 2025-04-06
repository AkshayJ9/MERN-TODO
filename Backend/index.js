import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import todoRoute from "../Backend/routes/todo.route.js";
import userRoute from "../Backend/routes/user.route.js";
import cookieParser from "cookie-parser";

// import cors from "cors";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4002;
const DB_URI = process.env.MONGODB_URI;

// Database Connection Code
try {
  await mongoose.connect(DB_URI);
  console.log("MongoDB connected successfully");
} catch (error) {
  console.log("MongoDB connection failed", error.message);
}

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// routes

app.use("/todo", todoRoute);
app.use("/user", userRoute);
// app.use(cors()); // Enable CORS for all routes

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
