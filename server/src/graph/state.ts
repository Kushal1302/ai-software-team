import type { BaseMessage } from "@langchain/core/messages";

export interface AgentState {
  // User task
  task: string;

  // Planner Agent
  plan?: string;

  // Who invoked tools
  activeToolCaller?: string;

  // Retrieval context
  retrievalContext?: {
    source: string;
    content: string;
  }[];

  relevantFiles?: string[];

  // Shared logs
  logs?: string[];

  // Current active agents
  currentAgent?: string;

  // Workflow status
  completed?: string;

  // Review output
  reviewResult?: string; // Review output
  validationResult?: string;

  retryCount?: number;

  // Conversation history for context (optional, can be used for more advanced implementations)
  messages?: BaseMessage[];

  // Git patch history
  patchHistory?: {
    file: string;
    timestamp: string;
  }[];

  taskType?: "frontend" | "backend" | "fullstack";
}
