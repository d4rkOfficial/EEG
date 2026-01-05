export type RequestType = 'set_deviceId' | 'set_clientType' | 'invalid' | 'export_csv'

const safeJsonParse = (json: string) => {
    try {
        return JSON.parse(json)
    } catch {
        return null
    }
}

type Result<T> = {
    requestType: RequestType,
    withValue: T,
}

export const handleJsonRequest = <T>(
    json: string,
): Result<T> => {
    const parsed = safeJsonParse(json)

    if (!parsed) {
        return {
            requestType: 'invalid',
            withValue: null as never,
        }
    }

    const [requestType, withValue] = parsed
    return {
        requestType,
        withValue,
    }
}
