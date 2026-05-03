import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";
import { runtimeEventEmitter } from "../events/eventEmitter.js";

export async function plannerAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== PLANNER AGENT ===");

  // emit event
  runtimeEventEmitter({
    type: "agent",
    agentId: "planner",
    message: "Planner agent started task decomposition.",
  });

  // load prompt
  const plannerPrompt = await fs.readFile("./src/prompts/planner.txt", "utf8");

  console.log({ plannerPrompt, task: state.task });

  // invoke model
  const response = await model.invoke(`
    ${plannerPrompt}
    
    TASK:
    ${state.task}`);

  console.log("\nRESPONSE:");
  console.log(response.content);

  // extract plan
  const plan = response.content.toString();

  console.log("\nPLAN:");
  console.log(plan);

  runtimeEventEmitter({
    type: "log",
    message: "Planner agent completed task decomposition." + plan,
  });

  return {
    plan,
    currentAgent: "planner",
    logs: [...(state.logs || []), "Planner completed task decomposition."],
  };
}
