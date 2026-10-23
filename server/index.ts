import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import recipeRouter from "./routes/recipeRoutes.js";
import type { Request, Response, NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all local dev origins
app.use(cors());

// Body parser
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/recipes", recipeRouter);
app.use("/recipes", recipeRouter); // backwards compatibility

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "CookCraft AI Recipe Generator API",
    timestamp: new Date().toISOString(),
  });
});

// Root ping
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "online",
    message: "CookCraft AI Recipe Generator API Server is running.",
  });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.stack || err.message);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
});

export default app;
