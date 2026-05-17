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
import { runtimeEventEmitter } from "./events/eventEmitter.js";
import { pendingApprovals } from "./runtime/approval-store.js";
import { extractMemory } from "./memory/extract-memory.js";
import { storeMemory } from "./memory/store-memory.js";
import { Command } from "@langchain/langgraph";
import { createThread, saveMessage } from "./services/conversation.service.js";
import { threadRoutes } from "./routes/thread.routes.js";

// Create a single instance of the workflow to be used across all requests
const workflow = await createWorkflow();

const app = new Hono();
// CORS should be called before the route
app.use("/*", cors());

app.onError((error, c) => {
  runtimeEventEmitter({
    type: "error",
    message: error.message,
  });
  return c.json({ message: error.message }, 500);
});

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

  // create a random thread on initial graph execution
  const threadId = crypto.randomUUID();

  // create the thread
  await createThread(threadId, task);

  // save the message
  await saveMessage({
    threadId,
    role: "user",
    type: "task",
    content: task,
  });

  const config = {
    configurable: {
      thread_id: threadId,
    },
    recursionLimit: 50,
  };

  const result = await workflow.invoke(
    {
      task,
      threadId,
    },
    config,
  );

  if (result && typeof result === "object" && "__interrupt__" in result) {
    const interruptValue = (result as any).__interrupt__[0].value;

    await saveMessage({
      threadId,
      role: "system",
      type: "approval",
      content: interruptValue.message,
    });

    runtimeEventEmitter({
      type: "approval",
      message: interruptValue.message,
      approvalId: config.configurable.thread_id,
    });

    return c.json({
      success: true,
    });
  }

  console.log("\n==================");

  console.log("FINAL STATE");

  console.log("==================");

  console.dir(result, {
    depth: null,
  });

  // extract and store important reusable engineering knowledge from the execution
  // const extracted = await extractMemory(
  //   result.task as string,
  //   result.logs as string[],
  // );

  // if (extracted) {
  //   await storeMemory(extracted);
  // }

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

app.post("/approval", async (c) => {
  try {
    const body = await c.req.json();

    const request = pendingApprovals.get(body.id);

    if (!request) {
      return c.json(
        {
          success: false,
          error: "Approval not found",
        },
        404,
      );
    }

    request.resolve(body.approved);

    pendingApprovals.delete(body.id);

    return c.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        success: false,
      },
      500,
    );
  }
});

// resume a workflow execution that was interrupted for approval
app.post("/resume", async (c) => {
  const body = await c.req.json();

  const result = await workflow.invoke(
    new Command({
      resume: body.approved,
    }),
    {
      configurable: {
        thread_id: body.threadId,
      },
    },
  );

  return c.json({
    success: true,
    result,
  });
});

// thread routes
app.route("/threads", threadRoutes);

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
