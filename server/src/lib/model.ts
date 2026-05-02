import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tools } from "../tools/index.js";

// Initialize the base model without tools
export const baseModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash-latest",
  temperature: 0,
  maxRetries: 0,
});

// Bind the tools to the base model to create the final model that can use the tools
export const model = baseModel.bindTools(tools);
