import { exec } from "child_process";
import util from "util";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AgentState } from "../graph/state.js";
import { model } from "../lib/model.js";

export async function changeSummaryAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  console.log("\n=== CHANGE SUMMARY ===");

  const humanMessage = new HumanMessage(`
USER ASKED:
${state.task}
`);

  const response = await model.invoke([
    new SystemMessage(
      "Summarize the current git diff clearly. Mention changed files and what changed. If there are no changes, say that.",
    ),
    humanMessage,
  ]);

  return {
    answer: response.content.toString(),
    currentAgent: "change-summary",
    messages: [humanMessage, response],
    logs: [...(state.logs || []), "Summarized current git diff"],
  };
}
