import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// Singleton Groq client instance reused across all controllers
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key_for_init",
});
