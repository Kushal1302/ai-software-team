import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { createWorkflow } from "./graph/workflow.js";
import { authMiddleware } from "./middleware/auth.js";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import { eventBus } from "./events/event-bus.js";
import type { RuntimeEvent } from "./events/types.js";
import { graphEdges, graphNodes } from "./graph/graph-config.js";

// Create a single instance of the workflow to be used across all requests
const workflow = await createWorkflow();

const app = new Hono();
// CORS should be called before the route
app.use("/*", cors());

app.onError((error, c) => c.json({ message: error.message }));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/events", (c: Context) => {
  return streamSSE(c, async (stream) => {
    const listener = async (event: RuntimeEvent) => {
      await stream.writeSSE({
        data: JSON.stringify(event),
        event: "runtime-event",
      });
    };

    eventBus.on("runtime-event", listener);

    while (true) {
      await stream.sleep(1000);
    }
  });
});

app.post("/ai-team", async (c: Context) => {
  const { task } = await c.req.json();

  const config = {
    configurable: {
      thread_id: "user-1",
    },
    recursionLimit: 50,
  };

  const result = await workflow.invoke(
    {
      task,
    },
    config,
  );

  console.log("\n==================");

  console.log("FINAL STATE");

  console.log("==================");

  console.dir(result, {
    depth: null,
  });

  return c.json({
    task: result.task,
    taskType: result.taskType,
    currentAgent: result.currentAgent,
    plan: result.plan,
    reviewResult: result.reviewResult,
    validationResult: result.validationResult,
    retryCount: result.retryCount,
    // logs: result.logs?.slice(-20),
    relevantFiles: result.relevantFiles,
    retrievalContext: result.retrievalContext,
    patchHistory: result.patchHistory,
    answer: result.answer,
  });
});

app.get("/graph", async (c) => {
  return c.json({
    nodes: graphNodes,

    edges: graphEdges,
  });
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
