import { getWorker } from '../workers.ts'
import { getClients } from './websocket-client.ts'

const packetParser = getWorker<
    import('../packet-parser.worker.ts').In,
    import('../packet-parser.worker.ts').Out
>('packet-parser')

const databaseWriter = getWorker<
    import('../database-writer.worker.ts').In,
    import('../database-writer.worker.ts').Out
>('database-writer')

packetParser.addEventListener('message', (event) => {
    const { deviceId, result } = event.data
    databaseWriter.postMessage({ deviceId, record: result })
    getClients()
        .filter((c) => c.deviceId === deviceId)
        .forEach((c) => {
            c.socket.send(JSON.stringify(result))
        })
})

export const handleSerialData = (deviceId: number, data: Uint8Array) => {
    if (data.length === 0) {
        return
    }
    packetParser.postMessage({ deviceId, chunk: data })
}
