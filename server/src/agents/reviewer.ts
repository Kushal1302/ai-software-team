import type { AgentState } from "../graph/state.js";
import fs from "fs/promises";
import { model } from "../lib/model.js";

export async function reviewerAgent(state: AgentState) {
  console.log("\n=== REVIEWER AGENT ===");

  const reviewerPrompt = await fs.readFile(
    "./src/prompts/reviewer.txt",
    "utf-8",
  );

  const response = await model.invoke(`
${reviewerPrompt}

TASK:
${state.task}

PLAN:
${state.plan}

LOGS:
${state.logs?.join("\n")}
`);

  const review = response.content.toString();

  console.log("\nREVIEW:");
  console.log(review);

  return {
    review,
    currentAgent: "reviewer",
    logs: [...(state.logs || []), "Reviewer completed analysis"],
  };
}
