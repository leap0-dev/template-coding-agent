import path from 'node:path';

import { Leap0Client, Sandbox } from 'leap0';

let clientInstance: Leap0Client | null = null;

export const getLeap0Client = (): Leap0Client => {
  if (!clientInstance) {
    clientInstance = new Leap0Client();
  }
  return clientInstance;
};

export const getSandboxById = async (sandboxId: string): Promise<Sandbox> => {
  const client = getLeap0Client();
  return client.sandboxes.get(sandboxId);
};

/** Default working directory used in Leap0 code-interpreter templates (see leap0-js docs). */
const WORKSPACE_ROOT = '/home/user';

const workspaceRootResolved = path.posix.resolve(WORKSPACE_ROOT);

const isUnderWorkspace = (resolved: string): boolean =>
  resolved === workspaceRootResolved || resolved.startsWith(`${workspaceRootResolved}/`);

export const normalizeSandboxPath = (inputPath: string): string => {
  const trimmed = inputPath.trim();
  if (trimmed === '' || trimmed === '/') {
    return workspaceRootResolved;
  }

  const resolved = trimmed.startsWith('/')
    ? path.posix.resolve(trimmed)
    : path.posix.resolve(WORKSPACE_ROOT, trimmed);

  if (!isUnderWorkspace(resolved)) {
    throw new Error(`Path is outside workspace (${WORKSPACE_ROOT}): ${inputPath}`);
  }

  return resolved;
};
