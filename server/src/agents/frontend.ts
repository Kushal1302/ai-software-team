import fs from "fs/promises";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { AgentState } from "../graph/state.js";

import { model } from "../lib/model.js";

export async function frontendAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== AUTONOMOUS FRONTEND ENGINEER ===");

  const frontendPrompt = await fs.readFile(
    "./src/prompts/frontend.txt",
    "utf-8",
  );

  const previousMessages = state.messages || [];

  const messages = [
    new SystemMessage(frontendPrompt),

    ...previousMessages,

    new HumanMessage(`
        TASK:
        ${state.task}

        PLAN:
        ${state.plan || "No plan available"}

        RETRIEVAL CONTEXT:
        ${JSON.stringify(state.retrievalContext || [], null, 2)}
    `),
  ];

  const response = await model.invoke(messages);

  console.log("\nFRONTEND RESPONSE:");

  console.log(response);

  return {
    currentAgent: "frontend-engineer",
    activeToolCaller: "frontend-engineer",
    messages: [response],
    logs: [...(state.logs || []), "Frontend engineer executed reasoning step"],
  };
}
