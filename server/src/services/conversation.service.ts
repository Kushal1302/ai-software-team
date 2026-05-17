import { prisma } from "../lib/prisma.js";

export async function createThread(threadId: string, task: string) {
  return prisma.workflowThread.create({
    data: {
      id: threadId,
      task,
      status: "running",
    },
  });
}

export async function saveMessage({
  threadId,
  role,
  type,
  content,
}: {
  threadId: string;
  role: string;
  type: string;
  content: string;
}) {
  return prisma.conversationMessage.create({
    data: {
      threadId,
      role,
      type,
      content,
    },
  });
}

export async function updateThreadStatus({
  threadId,
  status,
  interrupted,
}: {
  threadId: string;
  status: string;
  interrupted?: boolean;
}) {
  return prisma.workflowThread.update({
    where: {
      id: threadId,
    },
    data: {
      status,
      interrupted,
    },
  });
}

export async function getThreadMessages(threadId: string) {
  return prisma.conversationMessage.findMany({
    where: {
      threadId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
