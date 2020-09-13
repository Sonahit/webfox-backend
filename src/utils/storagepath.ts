import { join } from "path";

/**
 * Returns storage path
 *
 * @param {string} path
 *
 * @returns {string}
 */
export const storagePath = (path = ""): string => {
  return join(process.cwd(), "storage", path);
};
