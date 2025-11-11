type Reader = ReadableStreamDefaultReader<Uint8Array>
type BaudRates = 9600 | 14400 | 19200 | 28800 | 38400 | 57600 | 115200

const PortReaderMap = new Map<SerialPort, Reader>()

const requestSerialPort = async () => {
    try {
        const port = await navigator.serial.requestPort()
        return port
    } catch (error) {
        return null
    }
}

const openSerialPort = async (port: SerialPort, baudRate: BaudRates): Promise<Reader | null> => {
    try {
        await port.open({ baudRate })
        const stream = port.readable
        if (stream) {
            const reader = stream.getReader()
            PortReaderMap.set(port, reader)
            return reader
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}

const readSerial = async (reader: Reader) => {
    try {
        const { value, done } = await reader.read()
        if (done || !value) {
            return null
        }
        return value
    } catch (error) {
        return null
    }
}

const closeSerial = async (port: SerialPort) => {
    try {
        const reader = PortReaderMap.get(port)!
        await reader.cancel()
        await port.close()
    } catch (error) {}
}

export const serialLoop = (callback: (data: Uint8Array) => void, baudRate: BaudRates = 57600) => {
    let port!: SerialPort
    let data: Uint8Array
    let { promise: started, resolve: startResolve } = Promise.withResolvers<boolean>()

    const start = async () => {
        port = (await requestSerialPort())!
        if (!port) {
            return startResolve(false)
        }

        const reader = await openSerialPort(port, baudRate)
        if (!reader) {
            return startResolve(false)
        }

        startResolve(true)

        do {
            data = (await readSerial(reader)) || new Uint8Array(0)
            callback(data)
        } while (port.connected && data) // 不要拔掉串口接收器！！！
    }

    const close = () => closeSerial(port)

    return { start, close, started }
}
