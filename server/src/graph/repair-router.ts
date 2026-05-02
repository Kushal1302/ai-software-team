import { END } from "@langchain/langgraph";

import type { AgentState } from "./state.js";

export function repairRouter(state: AgentState) {
  const validation = state.validationResult || "";

  // Validation failed
  if (
    validation.toLowerCase().includes("failed") ||
    validation.toLowerCase().includes("error")
  ) {
    // Retry protection
    if ((state.retryCount || 0) > 3) {
      console.log("\nMAX RETRIES REACHED");

      return END;
    }

    console.log("\nVALIDATION FAILED → RETRY");

    return "backend-engineer";
  }

  console.log("\nVALIDATION PASSED");

  return END;
}
