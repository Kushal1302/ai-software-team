import type { AgentState } from "../graph/state.js";
import { searchRepository } from "../vector/retriever.js";
import { vectorStore } from "../vector/store.js";

export async function searchAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== SEARCH AGENT ===");

  // Search repo
  const results = await searchRepository(vectorStore, state.plan || state.task);

  console.log("\nRETRIEVED FILES:");

  for (const result of results) {
    console.log("\nFILE:", result.source);
  }

  return {
    relevantFiles: results,
    currentAgent: "searcher",
    logs: [
      ...(state.logs || []),
      `Searcher retrieved ${results.length} relevant files`,
    ],
  };
}
