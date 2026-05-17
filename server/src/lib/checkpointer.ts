import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

let checkpointer: PostgresSaver;

export async function getCheckpointer() {
  if (checkpointer) {
    return checkpointer;
  }

  checkpointer = PostgresSaver.fromConnString(process.env.POSTGRES_SAVER_URL!);

  await checkpointer.setup();

  return checkpointer;
}
