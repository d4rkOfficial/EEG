import { handleJsonRequest } from './handle-json-request.ts'
import { handleSerialData } from './handle-serial-data.ts'

type ClientType = 'tester' | 'testee'

const clients = new Set<WebSocketClient>()

export const getClients = () => {
    return [...clients]
}

export class WebSocketClient {
    public deviceId?: number
    public type!: ClientType

    constructor(public socket: WebSocket) {
        clients.add(this)

        socket.addEventListener('close', () => {
            clients.delete(this)
        })

        socket.addEventListener(
            'message',
            (event: MessageEvent<string | ArrayBuffer>) => {
                if (event.data instanceof ArrayBuffer) {
                    if (!this.deviceId || this.type !== 'tester') {
                        return
                    }
                    handleSerialData(this.deviceId, new Uint8Array(event.data))
                } else {
                    const { requestType, withValue } = handleJsonRequest(
                        event.data,
                    )

                    switch (requestType) {
                        case 'set_deviceId': {
                            this.deviceId = withValue as number
                            break
                        }
                        case 'set_clientType': {
                            this.type = withValue as ClientType
                            break
                        }
                    }
                }
            },
        )
    }
}
