import { Hono } from "hono";

import { getThreadMessages } from "../services/conversation.service.js";
import { prisma } from "../lib/prisma.js";

export const threadRoutes = new Hono();

threadRoutes.get(
  "/:threadId/messages",

  async (c) => {
    const threadId = c.req.param("threadId");

    const messages = await getThreadMessages(threadId);

    return c.json({
      success: true,
      messages,
    });
  },
);

threadRoutes.get(
  "/",

  async (c) => {
    const threads = await prisma.workflowThread.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return c.json({
      success: true,

      threads,
    });
  },
);
