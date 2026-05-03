import { tool } from "@langchain/core/tools";
import z from "zod";
import fs from "fs/promises";
import { runtimeEventEmitter } from "../../events/eventEmitter.js";
import { requestApproval } from "../../runtime/request-approval.js";

export const patchFileTool = tool(
  async ({ filePath, oldText, newText }) => {
    runtimeEventEmitter({
      type: "tool",
      message: "Patch file tool executed.",
    });

    // request user approval before making any changes to the file system, providing details about the proposed change
    const approved = await requestApproval(
      "patch_file",

      `Tool wants to patch file: ${filePath}\n\nOld text:\n\n${oldText}\n\nNew text:\n\n${newText}`,
    );

    if (!approved) return "Patch denied by user.";

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
