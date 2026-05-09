import { END } from "@langchain/langgraph";
import type { AgentState } from "./state.js";

function hasToolCall(state: AgentState) {
  const lastMessage = state.messages?.[state.messages.length - 1] as any;

  return Boolean(lastMessage?.tool_calls?.length);
}

export function searcherRouter(state: AgentState) {
  if (hasToolCall(state)) {
    return "tools";
  }

  return "classifier";
}

export function backendRouter(state: AgentState) {
  if (hasToolCall(state)) {
    return "tools";
  }

  return "reviewer";
}

export function frontendRouter(state: AgentState) {
  if (hasToolCall(state)) {
    return "tools";
  }

  return "reviewer";
}

export function reviewerRouter(state: AgentState) {
  if (hasToolCall(state)) {
    return "tools";
  }

  return "validator";
}

export const changeSummaryRouter = (state: AgentState) => {
  if (hasToolCall(state)) {
    return "tools";
  }

  return END;
};

export const answerRouter = (state: AgentState) => {
  if (hasToolCall(state)) {
    return "tools";
  }

  return END;
};
