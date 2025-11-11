import { getDatabase } from './get-database.ts'

const deviceIdTestIdMap = new Map<number, number>()

const testDate = new Date().toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

export const ensureTestId = (deviceId: number): number => {
    if (deviceIdTestIdMap.has(deviceId)) {
        return deviceIdTestIdMap.get(deviceId)!
    }

    const db = getDatabase()

    const [row] = db.query<[number]>(
        `SELECT test_id FROM tests WHERE device_id = ? AND test_date = ?`,
        [deviceId, testDate],
    )

    if (row) {
        return row[0]
    }

    const [[testId]] = db.query<[number]>(
        `INSERT INTO tests (device_id, test_date) VALUES (?, ?) RETURNING test_id`,
        [deviceId, testDate],
    )

    deviceIdTestIdMap.set(deviceId, testId)
    return testId
}
