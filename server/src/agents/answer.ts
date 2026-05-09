import fs from "fs/promises";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import { answerModel } from "../lib/model.js";
import { eventBus } from "../events/event-bus.js";

export async function answerAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== ANSWER AGENT ===");

  eventBus.emit("runtime-event", {
    type: "agent",
    agentId: "answer-agent",
    message: "Answer agent invoked with task: " + state.task,

    timestamp: new Date().toISOString(),
  });

  const prompt = await fs.readFile("./src/prompts/answer.txt", "utf-8");

  console.log({prompt});

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

  const response = await answerModel.invoke([
    new SystemMessage(prompt),
    ...(state.messages || []),
    humanMessage,
  ]);

  eventBus.emit("runtime-event", {
    type: "log",

    message:
      "Answer agent completed with answer: " + response.content.toString(),

    timestamp: new Date().toISOString(),
  });

  return {
    answer: response.content.toString(),
    currentAgent: "answer-agent",
    activeToolCaller: "answer-agent",
    messages: [humanMessage, response],
    logs: [...(state.logs || []), "Answered user question"],
  };
}
