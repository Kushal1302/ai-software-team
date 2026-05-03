export interface RuntimeEvent {
  type: "agent" | "tool" | "log" | "status" | "error" | "approval";

  agentId?: string;

  approvalId?: string;

  toolName?: string;

  message: string;

  timestamp: string;
}
