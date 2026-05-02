import type { AgentState } from "../graph/state.js";
import { runTypecheck } from "../tools/typecheck.js";

export async function validatorAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== VALIDATOR ===");

  const result = await runTypecheck();

  console.log("\nVALIDATION RESULT:");

  console.log(result);

  return {
    validationResult: result,

    currentAgent: "validator",

    retryCount: (state.retryCount || 0) + 1,

    logs: [...(state.logs || []), "Validator executed typecheck"],
  };
}
