import { END } from "@langchain/langgraph";
import type { AgentState } from "./state.js";

export async function supervisorRouter(state: AgentState) {
  // if no plan exists
  if (!state.plan) {
    return "planner";
  }

  // if files not found
  if (!state.relevantFiles) {
    return "searcher";
  }

  if (!state.currentAgent || state.currentAgent === "searcher") {
    return "backend-engineer";
  }

  // Reviewer
  if (state.currentAgent === "backend-engineer") {
    return "reviewer";
  }

  // Validator
  if (state.currentAgent === "reviewer") {
    return "validator";
  }

  // Validation failed
  if (
    state.currentAgent === "validator" &&
    state.validationResult?.includes("FAILED")
  ) {
    // Retry protection
    if ((state.retryCount || 0) > 3) {
      return END;
    }
    return "repair-agent";
  }

  // Repair loop
  if (state.currentAgent === "repair-agent") {
    return "backend-engineer";
  }

  return END;
}
