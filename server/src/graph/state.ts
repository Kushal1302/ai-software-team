import type { BaseMessage } from "@langchain/core/messages";

export interface AgentState {
  // User task
  task: string;

  // Planner Agent
  plan?: string;


// Retrieval context
  retrievalContext?: {
    source: string;
    content: string;
  }[];

  // Shared logs
  logs?: string[];

  // Current active agents
  currentAgent?: string;

  // Workflow status
  completed?: string;

  review?: string;
  validationResult?: string;

  retryCount?: number;

  // Conversation history for context (optional, can be used for more advanced implementations)
  messages?: BaseMessage[];

  // Git patch history
  patchHistory?: {
    file: string;
    timestamp: string;
  }[];
}
