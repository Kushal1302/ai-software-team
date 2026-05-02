import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { loadFiles } from "./file-loader.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

export async function createRepoIndex() {
  console.log("\nLoading repository...");

  // Load files
  const files = await loadFiles("./");

  console.log(`Loaded ${files.length} files`);

  const splitters = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks: string[] = [];
  const metadata: { source: string }[] = [];

  // process files
  for (const file of files) {
    const splitTexts = await splitters.splitText(file.content);

    for (const chunk of splitTexts) {
      chunks.push(chunk);

      metadata.push({
        source: file.path,
      });
    }
  }

  console.log(`Created ${chunks.length} chunks`);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
  });

  const vectorStore = await Chroma.fromTexts(chunks, metadata, embeddings, {
    collectionName: "software-team-repo-2",
  });

  console.log("\nVector DB ready");

  return vectorStore;
}
