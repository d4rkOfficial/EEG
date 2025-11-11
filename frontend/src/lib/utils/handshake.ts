type ClientType = 'tester' | 'testee'

export const handshake = async (ws: WebSocket, deviceId: number, clientType: ClientType) => {
    const { promise, resolve } = Promise.withResolvers<void>()

    ws.onopen = () => {
        ws.send(JSON.stringify(['set_deviceId', deviceId]))
        ws.send(JSON.stringify(['set_clientType', clientType]))
        ws.onopen = null
        resolve()
    }

    return promise
}
