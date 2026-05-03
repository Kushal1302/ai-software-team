import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tools } from "../tools/index.js";
import { ChatVertexAI } from "@langchain/google-vertexai";

// Initialize the base model without tools
export const baseModel = new ChatGoogleGenerativeAI({
  model: process.env.GOOGLE_MODEL || "gemini-3.1-flash-lite",
  temperature: 0,
  maxRetries: 0,
});

// const baseModel = new ChatVertexAI({
//   model: "gemini-3.1-flash-lite",
//   temperature: 0,
//   maxRetries: 0,
// });

// Bind the tools to the base model to create the final model that can use the tools
export const model = baseModel.bindTools(tools);
