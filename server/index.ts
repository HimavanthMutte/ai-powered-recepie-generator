import express from "express";
import connectDB from "./config/db.js";
import upload from "./middleware/upload.js";

import recipeRouter from "./routes/recipeRoutes.js";

import type { Request, Response, NextFunction } from "express";

await connectDB();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/recipes", recipeRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

app.post("/test-upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully", file: req.file });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server started running on ${process.env.PORT}`);
});
