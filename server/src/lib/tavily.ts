import { tavily } from "@tavily/core";

// Initialize the Tavily client with the API key from environment variables
export const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
