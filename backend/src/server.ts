import { commandLineInterfaceInit } from './server/command-line-interface-init.ts'
import { websocketServerInit } from './server/websocket-server-init.ts'

websocketServerInit({ port: 8080, hostname: '0.0.0.0' })
commandLineInterfaceInit()
