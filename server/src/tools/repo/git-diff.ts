import { tool } from "@langchain/core/tools";
import z from "zod";
import { exec } from "child_process";

import util from "util";
import { eventBus } from "../../events/event-bus.js";

const execAsync = util.promisify(exec);

export const gitDiffTool = tool(
  async () => {
    eventBus.emit("runtime-event", {
      type: "tool",

      message: "Generating git diff...",

      timestamp: new Date().toISOString(),
    });
    const result = await execAsync("git diff");

    // Emit diff event
    eventBus.emit("runtime-event", {
      type: "diff",

      message: result.stdout || "No changes detected",

      timestamp: new Date().toISOString(),
    });

    return result.stdout;
  },
  {
    name: "git_diff",
    description: `
    Get current git diff.
    Use for code review.
    `,
    schema: z.object({}),
  },
);
