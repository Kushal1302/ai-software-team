import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";

export async function plannerAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== PLANNER AGENT ===");

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

  return {
    plan,
    currentAgent: "planner",
    logs: [...(state.logs || []), "Planner completed task decomposition."],
  };
}
