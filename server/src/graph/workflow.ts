import { MemorySaver, START, StateGraph } from "@langchain/langgraph";
import type { AgentState } from "./state.js";
import { toolNode } from "./tool-node.js";
import { searchAgent } from "../agents/searcher.js";
import { plannerAgent } from "../agents/planner.js";
import { backendAgent } from "../agents/backend.js";
import { toolReturnRouter } from "./tool-return-router.js";
import { reviewerAgent } from "../agents/reviewer.js";
import { validatorAgent } from "../agents/validator.js";
import { classifierAgent } from "../agents/task-classifier.js";
import { frontendAgent } from "../agents/frontend.js";
import { taskRouter } from "./task-route.js";
import { validatorRouter } from "./validator-router.js";
import {
  backendRouter,
  changeSummaryRouter,
  frontendRouter,
  reviewerRouter,
  searcherRouter,
} from "./agent-router.js";
import { intentClassifierAgent } from "../agents/intent-classifier.js";
import { answerAgent } from "../agents/answer.js";
import { changeSummaryAgent } from "../agents/change-summary.js";
import { intentRouter } from "./intent-router.js";

// Initialize a single instance of MemorySaver to be used across the workflow
const memory = new MemorySaver();

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
      intent: {
        value: (x, y) => y ?? x,
      },
      answer: {
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
    .addNode("intent-classifier", intentClassifierAgent)
    .addNode("answer-agent", answerAgent)
    .addNode("change-summary", changeSummaryAgent)

    // flow
    .addEdge(START, "intent-classifier")
    .addConditionalEdges("intent-classifier", intentRouter)
    .addConditionalEdges("change-summary", changeSummaryRouter)
    // .addEdge(START, "planner")
    .addEdge("planner", "searcher")
    .addConditionalEdges("searcher", searcherRouter)
    // Dynamic engineer routing
    .addConditionalEdges("classifier", taskRouter)
    .addConditionalEdges("backend-engineer", backendRouter)
    .addConditionalEdges("frontend-engineer", frontendRouter)
    .addConditionalEdges("reviewer", reviewerRouter)
    .addConditionalEdges("validator", validatorRouter)
    // Tool returns
    .addConditionalEdges("tools", toolReturnRouter);

  return graph.compile({
    checkpointer: memory,
  });
}
