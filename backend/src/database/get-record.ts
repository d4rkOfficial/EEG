import { getDatabaseReadonly } from './get-database.ts'

type ResultRow = [
    timestamp: number,
    theta: number,
    low_alpha: number,
    high_alpha: number,
    low_beta: number,
    high_beta: number,
    low_gamma: number,
    middle_gamma: number,
    attention: number,
    meditation: number
]

type RecordResult = {
    deviceId: string
    testDate: string
    rows: ResultRow[]
}

export const getRecords = (testId?: number): RecordResult[] => {
    const results: RecordResult[] = []
    const tests = getDatabaseReadonly().query<[number, string, string]>(
        `SELECT test_id, device_id, test_date FROM tests`
    )

    for (const [_testId, deviceId, testDate] of tests) {
        if (testId != null && testId !== _testId) {
            continue
        }

        const rows = getDatabaseReadonly().query<ResultRow>(
            `SELECT timestamp, theta, low_alpha, high_alpha, low_beta, high_beta, low_gamma, middle_gamma, attention, meditation FROM records WHERE test_id = ?`,
            [_testId]
        )

        results.push({
            deviceId,
            testDate,
            rows,
        })
    }

    return results
}

// -- 1. get device_id by test_id, test_date
// -- 2. generate [device_id]-[test_date].csv
// -- 3. header = [timestamp, (beijing_time), theta, low_alpha, high_alpha, low_beta, high_beta, low_gamma, middle_gamma, attention, meditation]
// wa ju bue ru lao mai a ji. lu kien gia si ku. wa sha jing ru lao mai bue ru lao mai si si ku
// 