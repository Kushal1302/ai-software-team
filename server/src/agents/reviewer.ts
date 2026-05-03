import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { runtimeEventEmitter } from "../events/eventEmitter.js";

export async function reviewerAgent(state: AgentState) {
  console.log("\n=== AUTONOMOUS REVIEWER ===");

  runtimeEventEmitter({
    type: "agent",
    agentId: "reviewer",
    message: "Reviewer agent started code analysis",
  });

  const reviewerPrompt = await fs.readFile(
    "./src/prompts/reviewer.txt",
    "utf-8",
  );

  const previousMessages = state.messages || [];

  const humanMessage = new HumanMessage(`
      TASK:
      ${state.task}

      PLAN:
      ${state.plan || "No plan"}

      Please inspect git changes carefully.
    `);

  const messages = [
    new SystemMessage(reviewerPrompt),
    ...previousMessages,
    humanMessage,
  ];

  const response = await model.invoke(messages);

  console.log("\nREVIEWER RESPONSE:");
  console.log(response);

  runtimeEventEmitter({
    type: "log",
    message: "Reviewer agent completed code analysis.",
  });

  return {
    activeToolCaller: "reviewer",
    messages: [humanMessage, response],
    currentAgent: "reviewer",
    reviewResult: response.content.toString(),
    logs: [...(state.logs || []), "Reviewer completed code analysis"],
  };
}
