import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tools } from "../tools/index.js";

// Initialize a ToolNode with the list of tools
export const toolNode = new ToolNode(tools);
