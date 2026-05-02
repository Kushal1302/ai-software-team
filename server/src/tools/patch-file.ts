import fs from "fs/promises";

export async function patchFile({
  filePath,
  oldText,
  newText,
}: {
  filePath: string;
  oldText: string;
  newText: string;
}) {
  const original = await fs.readFile(filePath, "utf-8");

  // check oldText exists or not
  if (!original.includes(oldText)) {
    throw new Error("oldText not found");
  }

  const updated = original.replace(oldText, newText);

  await fs.writeFile(filePath, updated, "utf-8");

  return {
    success: true,
  };
}
