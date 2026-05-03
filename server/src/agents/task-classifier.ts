import fs from "fs/promises";

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type { AgentState } from "../graph/state.js";

import { model } from "../lib/model.js";

export async function classifierAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== TASK CLASSIFIER ===");

  const classifierPrompt = await fs.readFile(
    "./src/prompts/classifier.txt",
    "utf-8",
  );

  const humanMessage = new HumanMessage(`
TASK:
${state.task}
`);

  const response = await model.invoke([
    new SystemMessage(classifierPrompt),
    humanMessage,
  ]);

  const classification = response.content.toString().trim().toLowerCase();

  console.log("\nCLASSIFICATION:");

  console.log(classification);

  return {
    currentAgent: "classifier",
    logs: [...(state.logs || []), `Task classified as ${classification}`],
    messages: [humanMessage, response],
    taskType: classification as any,
  };
}
