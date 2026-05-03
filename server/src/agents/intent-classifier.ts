import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";

export const intentClassifierAgent = async (state: AgentState) => {
  console.log("\n=== INTENT CLASSIFIER ===");

  const prompt = await fs.readFile(
    "./src/prompts/intent-classifier.txt",
    "utf-8",
  );

  const humanMessage = new HumanMessage(`
        USER INPUT:
        ${state.task}
    `);

  const response = await model.invoke([
    new SystemMessage(prompt),
    humanMessage,
  ]);

  const intent = response.content.toString().trim().toLowerCase();

  console.log("\nINTENT:");
  console.log(intent);

  return {
    intent: intent as any,
    currentAgent: "intent-classifier",
    messages: [humanMessage, response],
    logs: [...(state.logs || []), `Intent classified as ${intent}`],
  };
};
