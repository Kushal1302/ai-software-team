import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { createWorkflow } from "./graph/workflow.js";

const app = new Hono();

app.onError((error, c) => c.json({ message: error.message }));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/ai-team", async (c: Context) => {
  const { input } = await c.req.json();

  const app = await createWorkflow();

  const result = await app.invoke({
    task: input,
  });

  console.log("\n==================");

  console.log("FINAL STATE");

  console.log("==================");

  console.dir(result, {
    depth: null,
  });

  return c.json(result);
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
