export type Packet = {
    signal: number,
    theta: number,
    lowAlpha: number,
    highAlpha: number,
    lowBeta: number,
    highBeta: number,
    lowGamma: number,
    middleGamma: number,
    attention: number,
    meditation: number,
    timestamp: number,
}

const mergeBytes = (b1: number, b2: number, b3: number) => {
    return (b1 << 16) | (b2 << 8) | b3
}

export const largePacketCheck = (bytes: Uint8Array) => {
    if (bytes.length < 36) {
        return false
    }
    if (bytes[0] !== 0xaa || bytes[1] !== 0xaa) {
        return false
    }
    if (bytes[2] !== 0x20 || bytes[3] !== 0x02) {
        return false
    }
    return true
}

export const smallPacketCheck = (bytes: Uint8Array) => {
    if (bytes.length < 8) {
        return false
    }
    if (bytes[0] !== 0xaa || bytes[1] !== 0xaa) {
        return false
    }
    if (bytes[2] !== 0x04 || bytes[3] !== 0x80) {
        return false
    }
    const sum = 0x80 + 0x02 + bytes[5] + bytes[6]
    return (((sum & 0xff) ^ 0xff) & 0xff) === bytes[7]
}

export const parseSmallPacket = (bytes: Uint8Array) => {
    let value = (bytes[5] << 8) | bytes[6]
    if (value > 32768) {
        value -= 65536
    }
    return value
}

export const parseLargePacket = (bytes: Uint8Array): Packet => {
    return {
        signal: bytes[4],
        theta: mergeBytes(bytes[7], bytes[8], bytes[9]),
        lowAlpha: mergeBytes(bytes[10], bytes[11], bytes[12]),
        highAlpha: mergeBytes(bytes[13], bytes[14], bytes[15]),
        lowBeta: mergeBytes(bytes[16], bytes[17], bytes[18]),
        highBeta: mergeBytes(bytes[19], bytes[20], bytes[21]),
        lowGamma: mergeBytes(bytes[22], bytes[23], bytes[24]),
        middleGamma: mergeBytes(bytes[25], bytes[26], bytes[27]),
        attention: bytes[31] === 0x04 ? bytes[32] : 0,
        meditation: bytes[33] === 0x05 ? bytes[34] : 0,
        timestamp: Date.now(),
    }
}
