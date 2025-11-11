import { commandHandler } from './command-handler.ts'

const { stdin } = Deno

const handleRead = async (
    handler: (line: string) => void,
    buf = new Uint8Array(1024),
    decoder = new TextDecoder('utf-8'),
) => {
    await stdin.read(buf)
    handler(decoder.decode(buf).trim())

    return handleRead(handler, buf, decoder)
}

export const commandLineInterfaceInit = () => {
    handleRead((line) => {
        if (!line) {
            return
        }

        const [cmd, ...args] = line
            .replaceAll(/[\n\r]/g, ' ')
            .replaceAll('\x00', '')
            .split(/ +/)

        commandHandler(cmd, ...args)
    })
}
