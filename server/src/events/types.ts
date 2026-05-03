export interface RuntimeEvent {
  type: "agent" | "tool" | "log" | "status" | "diff" | "error" | "approval";

  agentId?: string;

  message: string;

  toolName?:string;

  approvalId?: string;

  timestamp: string;
}
