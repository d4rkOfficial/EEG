// deno-lint-ignore-file
import { getRecords } from './get-record.ts'

const toBeijingTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour: '2-digit',
        second: '2-digit',
        minute: '2-digit',
        fractionalSecondDigits: 3
    })
}

export const exportCsv = async (testId?: number) => {
    const records = getRecords(testId)
    const encoder = new TextEncoder()
    const header = encoder.encode(
        'timestamp,bejing_time,theta,low_alpha,high_alpha,low_beta,high_beta,low_gamma,middle_gamma,attention,meditation\n'
    )

    for (const record of records) {
        const { deviceId, testDate, rows } = record
        const csvFilePath = `./dev-${deviceId}_${testDate}.csv`

        await Deno.writeFile(csvFilePath, header, { createNew: true })

        for (const row of rows) {
            const line = encoder.encode(
                row
                    .map((v, i) => (i === 0 ? `${v},${toBeijingTime(v)}` : v))
                    .join(',') + '\n'
            )
            await Deno.writeFile(csvFilePath, line, { append: true })
        }
    }
}
