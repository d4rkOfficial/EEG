/// <reference lib="webworker" />
import { BufferProcessor } from './utils/buffer-processor.ts'
import { largePacketCheck, type Packet, parseLargePacket } from './utils/packet.ts'

export type In = {
    deviceId: number,
    chunk: Uint8Array,
}

export type Out = {
    deviceId: number,
    result: Packet,
}

const bufferProcessors = new Map<number, BufferProcessor>()

const getBufferProcessor = (deviceId: number) => {
    if (bufferProcessors.has(deviceId)) {
        return bufferProcessors.get(deviceId)!
    }
    const bufferProcessor = new BufferProcessor()
    bufferProcessors.set(deviceId, bufferProcessor)
    enableBufferProcessor(deviceId, bufferProcessor)

    return bufferProcessor
}

const enableBufferProcessor = async (
    deviceId: number,
    processor: BufferProcessor,
) => {
    for await (const chunk of processor) {
        if (largePacketCheck(chunk)) {
            const result = parseLargePacket(chunk)
            self.postMessage({ deviceId, result } as Out)
        }
    }
}

self.addEventListener('message', (event: MessageEvent<In>) => {
    const { deviceId, chunk } = event.data
    const bufferProcessor = getBufferProcessor(deviceId)
    bufferProcessor.append(chunk)
})
