import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "../lib/model.js";

export const extractMemory = async (task: string, logs: string[]) => {
  try {
    const response = await model.invoke([
      new SystemMessage(`
        Extract important reusable engineering knowledge.

        Examples:
        - architecture patterns
        - framework usage
        - important repo locations
        - repeated failure reasons
        - implementation conventions

        Return concise bullet points only.
        `),

      new HumanMessage(`
        TASK:
        ${task}

        LOGS:
        ${logs.join("\n")}
        `),
    ]);
    return response.content.toString().trim();
  } catch (error) {
    console.error(error);

    return "";
  }
};
