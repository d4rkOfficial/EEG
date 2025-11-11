import { WebSocketClient } from './websocket-client.ts'

export const websocketServerInit = (options: Deno.ServeTcpOptions) => {
    return Deno.serve(options, (req) => {
        if (req.headers.get('upgrade') !== 'websocket') {
            return new Response(null, { status: 501 })
        }

        const { socket, response } = Deno.upgradeWebSocket(req)

        socket.addEventListener('open', () => {
            new WebSocketClient(socket)
        })

        return response
    })
}
