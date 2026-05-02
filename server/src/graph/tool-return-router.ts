import { END } from "@langchain/langgraph";
import type { AgentState } from "./state.js";

export const toolReturnRouter = (state: AgentState) => {
  const caller = state.activeToolCaller;

  if (!caller) {
    return END;
  }

  return caller;
};
