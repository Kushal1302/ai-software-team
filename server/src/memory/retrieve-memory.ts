import { getMemoryCollection } from "./collection.js";

export const retrieveMemories = async (query: string) => {
  try {
    const collection = await getMemoryCollection();

    const result = await collection.query({
      queryTexts: [query],
      nResults: 5,
    });

    return result.documents[0] || [];
  } catch (error) {
    console.error("Failed to retrieve memories", error);

    return [];
  }
};
