import express from "express";
import connectDB from "./config/db.js";

await connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started running on ${process.env.PORT}`);
});
