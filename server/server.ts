import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv"

dotenv.config()

await connectDB()

const app = express()


const PORT = process.env.PORT || 3000;

app.listen( PORT ,()=>{
    console.log(`Server started running on ${process.env.PORT}`)
})
