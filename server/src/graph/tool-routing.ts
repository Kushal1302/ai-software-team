import { END } from "@langchain/langgraph";

export const toolRouter = (state: any) => {
  const lastMessage = state.messages
    ? state.messages[state.messages.length - 1]
    : null;

  if (lastMessage.tool_calls?.length && "tool_calls" in lastMessage) {
    console.log("Routing to tools node", lastMessage.tool_calls[0].name);
    return "tools";
  }

  return END;
};
