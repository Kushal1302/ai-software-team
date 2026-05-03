import { eventBus } from "./event-bus.js";
import type { RuntimeEvent } from "./types.js";

// Emit runtime event
export const runtimeEventEmitter = ({
  type,
  agentId,
  message,
}: Partial<RuntimeEvent>) => {
  eventBus.emit("runtime-event", {
    type: type,
    agentId: agentId,
    message: message,

    timestamp: new Date().toISOString(),
  });
};
