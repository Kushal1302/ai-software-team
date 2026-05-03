import { ChromaClient } from "chromadb";

// chromadb client
export const chroma = new ChromaClient({
  path: process.env.CHROMA_URL!,
});
