import { tool } from "@langchain/core/tools";
import z from "zod";
import { runtimeEventEmitter } from "../../events/eventEmitter.js";
import { tavilyClient } from "../../lib/tavily.js";
import { interrupt } from "@langchain/langgraph";

export const searchWebTool = tool(
  async ({ query }) => {
    // Emit an event for logging or monitoring purposes
    runtimeEventEmitter({
      type: "tool",
      message: `Searching web: ${query}`,
    });

    const approved = interrupt({
      type: "approval",
      tool: "search_web",
      message: `We are about to search the web for: ${query}. Do you want to proceed?`,
    });

    if (!approved) {
      return "Web search cancelled by user.";
    }

    const response = await tavilyClient.search(query, {
      searchDepth: "advanced",
      maxResults: 5,
    });

    if (!response.results?.length) {
      return `
        No web results found.
        `;
    }

    const formatted = response.results
      .map(
        (result, index) => `
        [${index + 1}]

        TITLE:
        ${result.title}

        URL:
        ${result.url}

        CONTENT:
        ${result.content}
        `,
      )
      .join("\n\n");

    return formatted;
  },
  {
    name: "search_web",
    description: `
      Search the web for:
      - latest documentation
      - framework APIs
      - package usage
      - technical explanations
      - implementation examples
      - recent updates

      Use this for knowledge questions and external information retrieval.
`,
    schema: z.object({
      query: z.string(),
    }),
  },
);
