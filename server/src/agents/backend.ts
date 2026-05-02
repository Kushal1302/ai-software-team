import fs from "fs/promises";
import z from "zod/v3";
import type { AgentState } from "../graph/state.js";
import { model } from "../lib/model.js";
import { patchFile } from "../tools/patch-file.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const patchSchema = z.object({
  filePath: z.string(),
  oldText: z.string(),
  newText: z.string(),
});

export async function backendAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== AUTONOMOUS BACKEND ENGINEER ===");

  // Load prompt
  const backendPrompt = await fs.readFile("./src/prompts/backend.txt", "utf-8");

  // Existing memory
  const previousMessages = state.messages || [];

  // Build reasoning context
  const messages = [
    new SystemMessage(backendPrompt),

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

  console.log("\nBACKEND AGENT RESPONSE:");

  console.log(response);

  return {
    currentAgent: "backend-engineer",
    activeToolCaller: "backend-engineer",
    messages: [response],
    logs: [...(state.logs || []), "Backend engineer executed reasoning step"],
  };
}
