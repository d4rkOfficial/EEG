import { getDatabaseReadonly } from './get-database.ts'

export const getRecord = (testId?: number) => {
    if (!testId) {
        return getDatabaseReadonly().query(
            `SELECT * FROM records`,
        )
    }

    return getDatabaseReadonly().query(
        `SELECT * FROM records WHERE test_id = ?`,
        [testId],
    )
}
