import { tool } from "@langchain/core/tools";
import z from "zod";
import { exec } from "child_process";

import util from "util";

const execAsync = util.promisify(exec);

export const gitDiffTool = tool(
  async () => {
    const result = await execAsync("git diff");
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
