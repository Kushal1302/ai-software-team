// import { createRepoIndex } from "./indexer.js";

// export const vectorStore = await createRepoIndex();

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

/**
 * Initializes Google Generative AI Embeddings for converting text into vector representations.
 * The 'gemini-embedding-001' model is used for generating these embeddings.
 */
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
});

/**
 * Configures and exports a Chroma vector store instance.
 * This vector store uses the initialized Google Generative AI Embeddings.
 * It connects to a Chroma database running locally at 'http://localhost:8000'
 * and uses the collection named 'codebase-index' to store and retrieve vectors.
 */
export const vectorStore = new Chroma(embeddings, {
  collectionName: "software-team-repo-2",
  url: process.env.CHROMA_URL || "http://localhost:8000",
});