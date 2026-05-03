import type { AgentState } from "./state.js";

export const intentRouter = (state: AgentState) => {
  // Route based on intent
  if (state.intent === "question") {
    return "answer-agent";
  }

  if (state.intent === "change_summary") {
    return "change-summary";
  }

  return "planner";
};
