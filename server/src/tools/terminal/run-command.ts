import { tool } from "@langchain/core/tools";
import z from "zod";
import util from "util";
import { exec } from "child_process";

const execAsync = util.promisify(exec);

export const runCommandTool = tool(
  async ({ command }) => {
    try {
      const result = await execAsync(command);
      return `
        STDOUT:
        ${result.stdout}

        STDERR:
        ${result.stderr}
        `;
    } catch (error: any) {
      return `
        COMMAND FAILED

        STDOUT:
        ${error.stdout}

        STDERR:
        ${error.stderr}
        `;
    }
  },
  {
    name: "run_terminal",
    description: `
    Run terminal commands safely.
    Use for:
    - typecheck
    - tests
    - linting
    `,
    schema: z.object({
      command: z.string(),
    }),
  },
);
