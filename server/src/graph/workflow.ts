import { MemorySaver, START, StateGraph } from "@langchain/langgraph";
import type { AgentState } from "./state.js";
// import { plannerAgent } from "../agents/planner.js";
// import { searchAgent } from "../agents/searcher.js";
// import { supervisorRouter } from "./routing.js";
// import { backendAgent } from "../agents/backend.js";
// import { reviewerAgent } from "../agents/reviewer.js";
// import { validatorAgent } from "../agents/validator.js";
// import { repairAgent } from "../agents/repair.js";
import { autonomousEngineerAgent } from "../agents/autonomous-engineer.js";
import { toolRouter } from "./tool-routing.js";
import { toolNode } from "./tool-node.js";
import { searchAgent } from "../agents/searcher.js";
import { plannerAgent } from "../agents/planner.js";
import { backendAgent } from "../agents/backend.js";

export async function createWorkflow() {
  const graph = new StateGraph<AgentState>({
    channels: {
      task: {
        value: (x, y) => y ?? x,
      },
      plan: {
        value: (x, y) => y ?? x,
      },
      retrievalContext: {
        value: (x = [], y = []) => [...x, ...y],
      },
      patchHistory: {
        value: (x = [], y = []) => [...x, ...y],
      },
      currentAgent: {
        value: (x, y) => y ?? x,
      },
      completed: {
        value: (x, y) => y ?? x,
      },
      logs: {
        value: (x = [], y = []) => [...x, ...y],
      },
      // it wiill be array of messages
      messages: {
        value: (x = [], y = []) => [...x, ...y],
      },
      validationResult: {
        value: (x, y) => y ?? x,
      },
      retryCount: {
        value: (x, y) => y ?? x,
      },
    },
  })
    .addNode("planner", plannerAgent)
    .addNode("searcher", searchAgent)
    .addNode("backend-engineer", backendAgent)
    .addNode("tools", toolNode)

    // flow
    .addEdge(START, "planner")
    .addEdge("planner", "searcher")
    .addConditionalEdges("searcher", toolRouter)
    .addEdge("tools", "backend-engineer")
    .addConditionalEdges("backend-engineer", toolRouter);

  const memory = new MemorySaver();

  return graph.compile({
    checkpointer: memory,
  });
}
