import fs from "fs/promises";
import z from "zod/v3";
import type { AgentState } from "../graph/state.js";
import { model } from "../lib/model.js";
import { patchFile } from "../tools/patch-file.js";

const patchSchema = z.object({
  filePath: z.string(),
  oldText: z.string(),
  newText: z.string(),
});

export async function backendAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== BACKEND AGENT ===");

  // Load prompt
  const backendPrompt = await fs.readFile("./src/prompts/backend.txt", "utf-8");

  // Pick first retrieved file
  const targetFile = state.relevantFiles?.[0];

  if (!targetFile) {
    throw new Error("No relevant files found");
  }

  console.log(targetFile.source);

  const fileContent = await fs.readFile(targetFile.source, "utf-8");

  // Structured output
  const structuredModel = model.withStructuredOutput(patchSchema);

  // Generate patch
  const patch = await structuredModel.invoke(`
    ${backendPrompt}

    TASK:
    ${state.task}

    PLAN:
    ${state.plan}

    FILE PATH:
    ${targetFile.source}

    FILE CONTENT:
    ${fileContent}
    `);

  console.log("\nGENERATED PATCH:");

  // Apply patch
  await patchFile({
    filePath: patch.filePath,

    oldText: patch.oldText,

    newText: patch.newText,
  });

  return {
    currentAgent: "backend",
    logs: [...(state.logs || []), `Backend agent modified ${patch.filePath}`],
  };
}
