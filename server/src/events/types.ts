export interface RuntimeEvent {
  type: "agent" | "tool" | "log" | "status" | "diff" | "error";

  agentId?: string;

  message: string;

  timestamp: string;
}
