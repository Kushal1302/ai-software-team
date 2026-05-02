import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function reviewerAgent(state: AgentState) {
  console.log("\n=== AUTONOMOUS REVIEWER ===");

  const reviewerPrompt = await fs.readFile(
    "./src/prompts/reviewer.txt",
    "utf-8",
  );

  const previousMessages = state.messages || [];

  const messages = [
    new SystemMessage(reviewerPrompt),

    ...previousMessages,

    new HumanMessage(`
      TASK:
      ${state.task}

      PLAN:
      ${state.plan || "No plan"}

      Please inspect git changes carefully.
    `),
  ];

  const response = await model.invoke(messages);

  console.log("\nREVIEWER RESPONSE:");
  console.log(response);

  return {
    activeToolCaller: "reviewer",
    messages: [response],
    currentAgent: "reviewer",
    reviewResult: response.content.toString(),
    logs: [...(state.logs || []), "Reviewer completed code analysis"],
  };
}
