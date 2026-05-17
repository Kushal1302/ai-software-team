import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

let checkpointer: PostgresSaver;

export async function getCheckpointer() {
  if (checkpointer) {
    return checkpointer;
  }

  checkpointer = PostgresSaver.fromConnString(process.env.DATABASE_URL!);

  await checkpointer.setup();

  return checkpointer;
}
