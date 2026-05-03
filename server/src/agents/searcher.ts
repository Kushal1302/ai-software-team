import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import { searchRepository } from "../vector/retriever.js";
import { vectorStore } from "../vector/store.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";

export async function searchAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== AUTONOMOUS SEARCHER ===");

  // Load prompt
  const prompt = await fs.readFile("./src/prompts/searcher.txt", "utf-8");

  // Existing messages
  const previousMessages = state.messages || [];

  const humanMessage = new HumanMessage(`
TASK:
${state.task}

PLAN:
${state.plan}
`);

  // Create reasoning context
  const messages = [
    new SystemMessage(prompt),

    ...previousMessages,

    humanMessage,
  ];

  // Invoke model
  const response = await model.invoke(messages);

  console.log("\nSEARCHER RESPONSE:");
  console.log(response);

  return {
    currentAgent: "searcher",
    activeToolCaller: "searcher",
    messages: [humanMessage, response],
    logs: [...(state.logs || []), "Searcher executed retrieval reasoning"],
  };
}
