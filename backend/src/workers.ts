type scriptNames =
    | 'packet-parser' //
    | 'database-writer' //

const toWorkerUrl = (
    await Array.fromAsync(Deno.readDir(new URL('.', import.meta.url)))
).some((f) => f.name === 'server.js' && f.isFile)
    ? (scriptName: string) =>
          new URL(`./${scriptName}.worker.js`, import.meta.url)
    : (scriptName: string) =>
          new URL(`./${scriptName}.worker.ts`, import.meta.url)

const workers = new Map<string, Worker>()

type _Worker<In, Out> = {
    // onmessage?: ((event: MessageEvent<Out>) => void) | null
    postMessage:
        | ((message: In, transfer?: Transferable[]) => void)
        | ((message: In, options?: StructuredSerializeOptions) => void)
    addEventListener: (
        type: 'message',
        listener: (event: MessageEvent<Out>) => void
    ) => void
}

export const getWorker = <In, Out>(
    scriptName: scriptNames
): _Worker<In, Out> => {
    if (workers.has(scriptName)) {
        return workers.get(scriptName)!
    }
    const worker = new Worker(toWorkerUrl(scriptName), { type: 'module' })
    workers.set(scriptName, worker)

    return worker
}
