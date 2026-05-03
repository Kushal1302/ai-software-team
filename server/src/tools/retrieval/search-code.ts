import { tool } from "@langchain/core/tools";
import z from "zod";
import { searchRepository } from "../../vector/retriever.js";
import { vectorStore } from "../../vector/store.js";
import { runtimeEventEmitter } from "../../events/eventEmitter.js";

export const searchCodeTool = tool(
  async ({ query }) => {
    runtimeEventEmitter({
      type: "tool",
      message: "Search code tool executed.",
    });

    const resutls = await searchRepository(vectorStore, query);

    return JSON.stringify(resutls, null, 2);
  },
  {
    name: "search_code",
    description: `
Search repository semantically.

Use for:
- finding relevant files
- architecture tracing
- locating implementations
- dependency analysis
`,
    schema: z.object({
      query: z.string(),
    }),
  },
);
