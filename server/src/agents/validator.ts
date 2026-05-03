import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";
import { runtimeEventEmitter } from "../events/eventEmitter.js";

export async function validatorAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== AUTONOMOUS VALIDATOR ===");

  runtimeEventEmitter({
    type: "agent",
    agentId: "validator",
    message: "Validator agent started validation workflow",
  });

  const validatorPrompt = await fs.readFile(
    "./src/prompts/validator.txt",
    "utf-8",
  );

  const previousMessages = state.messages || [];

  const humanMessage = new HumanMessage(`
      TASK:
      ${state.task}

      REVIEW RESULT:
      ${state.reviewResult || "No review"}

      Run validation carefully.
    `);

  const messages = [
    new SystemMessage(validatorPrompt),
    ...previousMessages,
    humanMessage,
  ];

  const response = await model.invoke(messages);
  console.log("\nVALIDATOR RESPONSE:");
  console.log(response);

  const validationText = response.content.toString();

  runtimeEventEmitter({
    type: "log",
    message: "Validator agent completed validation workflow.",
  });

  return {
    validationResult: validationText,
    currentAgent: "validator",
    activeToolCaller: "validator",
    messages: [humanMessage, response],
    retryCount: (state.retryCount || 0) + 1,
    logs: [...(state.logs || []), "Validator executed validation workflow"],
  };
}
