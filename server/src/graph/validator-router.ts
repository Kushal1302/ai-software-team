import { END } from "@langchain/langgraph";
import type { AgentState } from "./state.js";

export function validatorRouter(state: AgentState) {
  const lastMessage = state.messages?.[state.messages.length - 1] as any;

  if (lastMessage?.tool_calls?.length) {
    return "tools";
  }

  const validation = state.validationResult || "";

  if (
    validation.toLowerCase().includes("failed") ||
    validation.toLowerCase().includes("error")
  ) {
    if ((state.retryCount || 0) > 3) {
      console.log("\nMAX RETRIES REACHED");

      return END;
    }
    return state.taskType === "frontend"
      ? "frontend-engineer"
      : "backend-engineer";
  }

  return END;
}
