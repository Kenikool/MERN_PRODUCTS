import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import AppError from "./utils/appError.js";
import dashboardRoute from "./routes/dashboardStats.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// routes

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/dashboard", dashboardRoute);

// --- ERROR HANDLING ---

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server connected on port: ${PORT}`);
  connectDB();
});
