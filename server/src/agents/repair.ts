import type { AgentState } from "../graph/state.js";
import { model } from "../lib/model.js";

export async function repairAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== REPAIR AGENT ===");

  const response = await model.invoke(`
You are an autonomous repair agent.

TASK:
${state.task}

VALIDATION ERRORS:
${state.validationResult}

Your job:
- analyze errors
- determine likely failure
- suggest repair strategy
`);

  console.log("\nREPAIR ANALYSIS:");

  console.log(response.content);

  return {
    currentAgent: "repair-agent",

    logs: [...(state.logs || []), "Repair agent analyzed validation errors"],
  };
}
