import { getMemoryCollection } from "./collection.js";

export const storeMemory = async (memory: string) => {
  try {
    // get or create the collection
    const collection = await getMemoryCollection();

    // add the memory to the collection
    await collection.add({
      ids: [crypto.randomUUID()],
      documents: [memory],
    });

    console.log("\n🧠 MEMORY STORED:");
  } catch (error) {
    console.error("Failed to store memory", error);
  }
};
