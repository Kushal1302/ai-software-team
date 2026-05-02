import { exec } from "child_process";

import util from "util";

const execAsync = util.promisify(exec);

export async function runTypecheck() {
  try {
    const result = await execAsync("npm run typecheck");

    return `
TYPECHECK PASSED

${result.stdout}
`;
  } catch (error: any) {
    return `
TYPECHECK FAILED

${error.stdout}

${error.stderr}
`;
  }
}
