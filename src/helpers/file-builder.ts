/**
 * File output helpers wrapping Supernova's FileHelper.
 * Since we can't import FileHelper directly in non-Pulsar context,
 * we define our own output file interface for testing and
 * use the real FileHelper only in index.ts.
 */

/** Platform-agnostic output file interface. */
export interface OutputFile {
  relativePath: string;
  fileName: string;
  content: string;
}

/** Create a text output file descriptor. */
export function createOutputFile(
  basePath: string,
  fileName: string,
  content: string,
): OutputFile {
  return {
    relativePath: basePath,
    fileName,
    content,
  };
}
