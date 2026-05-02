import { START, StateGraph } from "@langchain/langgraph";
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

export async function createWorkflow() {
  const graph = new StateGraph<AgentState>({
    channels: {
      task: {
        value: (x, y) => y ?? x,
      },
      plan: {
        value: (x, y) => y ?? x,
      },
      relevantFiles: {
        value: (x, y) => y ?? x,
      },
      currentAgent: {
        value: (x, y) => y ?? x,
      },
      completed: {
        value: (x, y) => y ?? x,
      },
      logs: {
        value: (x, y) => y ?? x,
      },
    },
  })
    // .addNode("planner", plannerAgent)
    // .addNode("searcher", searchAgent)
    // .addNode("backend-engineer", backendAgent)
    // .addNode("reviewer", reviewerAgent)
    // .addNode("validator", validatorAgent)
    // .addNode("repairt-agent", repairAgent)
    // .addEdge(START, "planner")
    // .addConditionalEdges("planner", supervisorRouter)
    // .addConditionalEdges("searcher", supervisorRouter);

    .addNode("autonomous-engineer", autonomousEngineerAgent)
    .addNode("tools", toolNode)
    .addEdge(START, "autonomous-engineer")
    .addConditionalEdges("autonomous-engineer", toolRouter)
    .addEdge("tools", "autonomous-engineer");

  return graph.compile();
}
