import type { AgentState } from "./state.js";

export const intentRouter = (state: AgentState) => {
  console.log("ENTER here intent router with state", state.intent);
  // Route based on intent
  if (state.intent === "question") {
    return "answer-agent";
  }

  if (state.intent === "change_summary") {
    return "change-summary";
  }

  console.log("No specific intent matched, defaulting to planner");

  return "planner";
};
