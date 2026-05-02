import fs from "fs/promises";
import path from "path";

export async function loadFiles(dir: string) {
  const results: {
    path: string;
    content: string;
  }[] = [];

  const walk = async (currentDir: string) => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      // Ignore heavy folders
      if (
        fullPath.includes("node_modules") ||
        fullPath.includes(".next") ||
        fullPath.includes(".git")
      ) {
        continue;
      }

      // directory recursion eg. /src/components/table.tsx
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      // File filters
      const validExtensions = [".ts", ".tsx", ".js", ".jsx"];

      const isValid = validExtensions.some((ext) => fullPath.endsWith(ext));

      if (!isValid) {
        continue;
      }

      // Read file contents
      const content = await fs.readFile(fullPath, "utf-8");

      //   push content and path to results
      results.push({
        path: fullPath,
        content,
      });
    }
  };

  await walk(dir);
  return results;
}
