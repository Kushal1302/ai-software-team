export interface RuntimeEvent {
  type: "agent" | "tool" | "log" | "status" | "error";

  agentId?: string;

  message: string;

  timestamp: string;
}
