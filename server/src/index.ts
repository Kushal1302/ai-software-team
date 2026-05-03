import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { createWorkflow } from "./graph/workflow.js";
import { authMiddleware } from "./middleware/auth.js";

// Create a single instance of the workflow to be used across all requests
const workflow = await createWorkflow();

const app = new Hono();

app.onError((error, c) => c.json({ message: error.message }));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use("/ai-team", authMiddleware);

app.post("/ai-team", async (c: Context) => {
  const { input } = await c.req.json();

  const config = {
    configurable: {
      thread_id: "user-1",
    },
    recursionLimit: 50,
  };

  const result = await workflow.invoke(
    {
      task: input,
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

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
