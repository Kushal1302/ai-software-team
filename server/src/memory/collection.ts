import { chroma } from "./client.js";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";
const embeddingFunction = new DefaultEmbeddingFunction();

export async function getMemoryCollection() {
  return await chroma.getOrCreateCollection({
    name: "engineering-memory",
    embeddingFunction,
  });
}
