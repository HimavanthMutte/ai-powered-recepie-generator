import express from "express";
import connectDB from "./config/db.js";
import upload from "./middleware/upload.js";

await connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.post("/test-upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully", file: req.file });
});

app.listen(PORT, () => {
  console.log(`Server started running on ${process.env.PORT}`);
});
