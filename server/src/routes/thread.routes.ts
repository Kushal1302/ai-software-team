import { Hono } from "hono";

import { getThreadMessages } from "../services/conversation.service.js";

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
