export interface ApprovalRequest {
  id: string;
  tool: string;
  reason: string;
  resolve: (approved: boolean) => void;
}

// we are using map here to store pending approvals in memory, keyed by their unique ID
export const pendingApprovals = new Map<string, ApprovalRequest>();
