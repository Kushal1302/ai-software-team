import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import { model } from "../lib/model.js";

export const autonomousEngineerAgent = async (state: AgentState) => {
  console.log("\n=== AUTONOMOUS ENGINEER ===");
  const messages = [
    new SystemMessage(`You are an autonomous senior software engineer.

            RULES:
            - ALWAYS inspect code before editing
            - Use tools carefully
            - Make minimal safe edits
            - Run validation after changes
            - Use git diff for review
            - Think step-by-step
            `),
    ...(state.messages || []),

    new HumanMessage(`
        TASK:
        ${state.task}
    `),
  ];

  const response = await model.invoke(messages);

  console.log("\nAGENT RESPONSE:");

  console.log(response);

  return {
    currentAgent: "autonomous-engineer",
    messages: [...(state.messages || []), response],
    logs: [
      ...(state.logs || []),
      "Autonomous engineer executed reasoning step",
    ],
  };
};
