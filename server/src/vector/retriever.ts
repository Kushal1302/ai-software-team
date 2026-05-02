import type { VectorStore } from "@langchain/core/vectorstores";

export async function searchRepository(
  vectorStore: VectorStore,
  query: string,
) {
  // search repository
  const results = await vectorStore.similaritySearch(query, 5);

  return results.map((result) => ({
    source: result.metadata.source,
    content: result.pageContent,
  }));
}
