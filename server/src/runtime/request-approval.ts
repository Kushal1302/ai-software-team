import { runtimeEventEmitter } from "../events/eventEmitter.js";
import { pendingApprovals } from "./approval-store.js";

export const requestApproval = (
  tool: string,
  reason: string,
): Promise<boolean> => {
  return new Promise((resolve) => {
    const id = crypto.randomUUID();

    // store the approval request in the pendingApprovals map, so it can be resolved later when the user approves or denies it
    pendingApprovals.set(id, {
      id,
      tool,
      reason,
      resolve,
    });

    // emit an event to notify the frontend that a new approval request has been created, so it can display it to the user
    runtimeEventEmitter({
      type: "approval",
      message: reason,
      approvalId: id,
      toolName: tool,
    });
  });
};
