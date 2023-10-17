/**
 * Creates a version of the resource that can be disposed of
 * at the end of a function block.
 *
 * @param resource  Resource to make disposable.
 * @param callback  Function to call when disposing of the resource.
 * @returns Disposable version of the resource.
 *
 * @example
 * ```typescript
 * import { disposable } from "@pacote/disposable"
 * import fs from "node:fs"
 *
 * const getFileHandle = (path: string) => {
 *   const descriptor = fs.openSync(path)
 *   return disposable(
 *     {
 *       read: (buffer) => fs.readSync(descriptor, buffer),
 *     },
 *     () => fs.closeSync(descriptor),
 *   };
 * };
 *
 * {
 *   using fileHandle = getFileHandle("file.txt");
 *   fileHandle.read(buffer)
 *   // descriptor is automatically closed
 * }
 * ```
 */
export function disposable<T extends object>(
  resource: T,
  callback: () => void,
): T & Disposable {
  return {
    ...resource,
    [Symbol.dispose]: callback,
  }
}

/**
 * Creates a version of the resource that can be disposed of
 * asynchronously at the end of a function block.
 *
 * @param resource  Resource to make asynchronously disposable.
 * @param callback  Function to call when disposing of the resource.
 * @returns Asynchronously disposable version of the resource.
 *
 * @example
 * ```typescript
 * import { open } from "node:fs/promises"
 * import { asyncDisposable } from "@pacote/disposable"
 *
 * const getFileHandle = async (path: string) => {
 *   const fileHandle = await open(path)
 *   return asyncDisposable(fileHandle, fileHandle.close)
 * };
 *
 * {
 *   await using fileHandle = await getFileHandle("file.txt");
 *   await fileHandle.read(buffer)
 *   // fileHandle is automatically closed
 * }
 * ```
 */
export function asyncDisposable<T extends object>(
  resource: T,
  callback: () => Promise<void>,
): T & AsyncDisposable {
  return {
    ...resource,
    [Symbol.asyncDispose]: callback,
  }
}
