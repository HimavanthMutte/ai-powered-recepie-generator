import express from "express";

import dotenv from "dotenv"

dotenv.config()

const app = express()

app.listen(process.env.PORT || 3000 ,()=>{
    console.log(`Server started running on ${process.env.PORT}`)
})
