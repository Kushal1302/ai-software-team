import { chroma } from "./client.js";

export async function getMemoryCollection() {
  return await chroma.getOrCreateCollection({
    name: "engineering-memory",
  });
}
