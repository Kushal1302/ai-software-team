import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";
import { eventBus } from "../events/event-bus.js";

export const intentClassifierAgent = async (state: AgentState) => {
  console.log("\n=== INTENT CLASSIFIER ===");

  // Emit event
  eventBus.emit("runtime-event", {
    type: "agent",
    agentId: "intent-classifier",
    message: "Intent classifier agent invoked with task: " + state.task,
    timestamp: new Date().toISOString(),
  });

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

  eventBus.emit("runtime-event", {
    type: "log",

    message: "intent classfier agent completed with intent: " + intent,

    timestamp: new Date().toISOString(),
  });

  return {
    intent: intent as any,
    currentAgent: "intent-classifier",
    messages: [humanMessage, response],
    logs: [...(state.logs || []), `Intent classified as ${intent}`],
  };
};
