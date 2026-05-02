import { tool } from "@langchain/core/tools";
import z from "zod";
import fs from "fs/promises";

export const patchFileTool = tool(
  async ({ filePath, oldText, newText }) => {
    const original = await fs.readFile(filePath, "utf8");

    if (!original.includes(oldText)) {
      throw new Error(
        `
        Old text not found.
        `,
      );
    }

    const updated = original.replace(oldText, newText);
    await fs.writeFile(filePath, updated, "utf8");
    return `
        Patch applied successfully.

        FILE:
        ${filePath}
`;
  },
  {
    name: "patch_file",
    description: `
    Safely patch files by replacing exact text.
Use minimal edits only.`,
    schema: z.object({
      filePath: z.string(),
      oldText: z.string(),
      newText: z.string(),
    }),
  },
);
