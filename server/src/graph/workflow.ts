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
import { toolReturnRouter } from "./tool-return-router.js";
import { reviewerAgent } from "../agents/reviewer.js";
import { validatorAgent } from "../agents/validator.js";
import { repairRouter } from "./repair-router.js";
import { classifierAgent } from "../agents/task-classifier.js";
import { frontendAgent } from "../agents/frontend.js";
import { taskRouter } from "./task-route.js";

export async function createWorkflow() {
  const graph = new StateGraph<AgentState>({
    channels: {
      task: {
        value: (x, y) => y ?? x,
      },
      taskType: {
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
      activeToolCaller: {
        value: (x, y) => y ?? x,
      },
    },
  })
    .addNode("planner", plannerAgent)
    .addNode("searcher", searchAgent)
    .addNode("classifier", classifierAgent)
    .addNode("reviewer", reviewerAgent)
    .addNode("validator", validatorAgent)
    .addNode("frontend-engineer", frontendAgent)
    .addNode("backend-engineer", backendAgent)
    .addNode("tools", toolNode)

    // flow
    .addEdge(START, "planner")
    .addEdge("planner", "searcher")
    .addEdge("searcher", "classifier")
    // Dynamic engineer routing
    .addConditionalEdges("classifier", taskRouter)
    .addEdge("backend-engineer", "reviewer")
    .addEdge("frontend-engineer", "reviewer")
    .addEdge("reviewer", "validator")
    // Tool loops
    .addConditionalEdges("searcher", toolRouter)

    .addConditionalEdges("backend-engineer", toolRouter)

    .addConditionalEdges("frontend-engineer", toolRouter)

    .addConditionalEdges("reviewer", toolRouter)

    .addConditionalEdges("validator", toolRouter)

    // Tool returns
    .addConditionalEdges("tools", toolReturnRouter)

    // Repair loop
    .addConditionalEdges("validator", repairRouter);

  const memory = new MemorySaver();

  return graph.compile({
    checkpointer: memory,
  });
}
