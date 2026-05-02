import { tool } from "@langchain/core/tools";
import z from "zod";
import fs from "fs/promises";

export const readFileTool = tool(
  async ({ filePath }) => {
    const content = await fs.readFile(filePath, "utf8");
    return content;
  },
  {
    name: "read_file",
    description: `
    Read file contents.
Use before editing code.`,
    schema: z.object({
      filePath: z.string(),
    }),
  },
);
