import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";

export async function validatorAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== AUTONOMOUS VALIDATOR ===");

  const validatorPrompt = await fs.readFile(
    "./src/prompts/validator.txt",
    "utf-8",
  );

  const previousMessages = state.messages || [];

  const messages = [
    new SystemMessage(validatorPrompt),

    ...previousMessages,

    new HumanMessage(`
      TASK:
      ${state.task}

      REVIEW RESULT:
      ${state.reviewResult || "No review"}

      Run validation carefully.
    `),
  ];

  const response = await model.invoke(messages);
  console.log("\nVALIDATOR RESPONSE:");
  console.log(response);

  const validationText = response.content.toString();

  return {
    validationResult: validationText,
    currentAgent: "validator",
    activeToolCaller: "validator",
    messages: [response],
    retryCount: (state.retryCount || 0) + 1,
    logs: [...(state.logs || []), "Validator executed validation workflow"],
  };
}
