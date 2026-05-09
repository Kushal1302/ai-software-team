import { patchFileTool } from "./filesystem/patch-file.js";
import { readFileTool } from "./filesystem/read-file.js";
import { gitDiffTool } from "./repo/git-diff.js";
import { searchCodeTool } from "./retrieval/search-code.js";
import { searchWebTool } from "./retrieval/search-web.js";
import { runCommandTool } from "./terminal/run-command.js";

export const tools = [
  readFileTool,
  patchFileTool,
  runCommandTool,
  gitDiffTool,
  searchCodeTool,
  searchWebTool,
];
