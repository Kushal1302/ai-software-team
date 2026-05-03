import fs from "fs/promises";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import { model } from "../lib/model.js";

export async function answerAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== ANSWER AGENT ===");

  const humanMessage = new HumanMessage(`
QUESTION:
${state.task}

CONTEXT:
${JSON.stringify(
  {
    plan: state.plan,
    taskType: state.taskType,
    validationResult: state.validationResult,
    logs: state.logs,
  },
  null,
  2,
)}
`);

  const response = await model.invoke([
    new SystemMessage(
      "You answer questions about this coding assistant clearly and concisely. Do not modify files.",
    ),
    ...(state.messages || []),
    humanMessage,
  ]);

  return {
    answer: response.content.toString(),
    currentAgent: "answer-agent",
    messages: [humanMessage, response],
    logs: [...(state.logs || []), "Answered user question"],
  };
}
