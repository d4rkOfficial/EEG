/// <reference lib="webworker" />
import { ensureTestId } from './database/ensure-test-id.ts'
import { insertRecord } from './database/insert-record.ts'
import { type Packet } from './utils/packet.ts'

export type In = {
    deviceId: number,
    record: Packet,
}

export type Out = never

self.addEventListener('message', (event: MessageEvent<In>) => {
    const { deviceId, record } = event.data

    insertRecord(ensureTestId(deviceId), record)
})
