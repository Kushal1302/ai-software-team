import type { AgentState } from "./state.js";

export function taskRouter(state: AgentState) {
  const type = state.taskType;

  if (type === "frontend") {
    return "frontend-engineer";
  }

  if (type === "backend") {
    return "backend-engineer";
  }

  // fullstack fallback
  return "backend-engineer";
}
