import fs from "fs/promises";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { AgentState } from "../graph/state.js";

import { model } from "../lib/model.js";
import { runtimeEventEmitter } from "../events/eventEmitter.js";

export async function frontendAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== AUTONOMOUS FRONTEND ENGINEER ===");

  runtimeEventEmitter({
    type: "agent",
    agentId: "frontend-engineer",
    message: "Frontend engineer agent started implementation reasoning.",
  });

  const frontendPrompt = await fs.readFile(
    "./src/prompts/frontend.txt",
    "utf-8",
  );

  const previousMessages = state.messages || [];

  const humanMessage = new HumanMessage(`
        TASK:
        ${state.task}

        PLAN:
        ${state.plan || "No plan available"}

        RETRIEVAL CONTEXT:
        ${JSON.stringify(state.retrievalContext || [], null, 2)}
    `);

  const messages = [
    new SystemMessage(frontendPrompt),
    ...previousMessages,
    humanMessage,
  ];

  const response = await model.invoke(messages);

  console.log("\nFRONTEND RESPONSE:");

  console.log(response);

  runtimeEventEmitter({
    type: "log",
    message: "Frontend engineer agent completed implementation reasoning.",
  });

  return {
    currentAgent: "frontend-engineer",
    activeToolCaller: "frontend-engineer",
    messages: [humanMessage, response],
    logs: [...(state.logs || []), "Frontend engineer executed reasoning step"],
  };
}
