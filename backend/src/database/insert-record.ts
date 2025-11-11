import { getDatabase } from './get-database.ts'

type Data = {
    timestamp: number,
    theta: number,
    lowAlpha: number,
    highAlpha: number,
    lowBeta: number,
    highBeta: number,
    lowGamma: number,
    middleGamma: number,
    attention: number,
    meditation: number,
}

export const insertRecord = (testId: number, data: Data) => {
    getDatabase().query(
        `INSERT INTO records (test_id, timestamp, theta, low_alpha, high_alpha, low_beta, high_beta, low_gamma, middle_gamma, attention, meditation) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
            testId,
            data.timestamp,
            data.theta,
            data.lowAlpha,
            data.highAlpha,
            data.lowBeta,
            data.highBeta,
            data.lowGamma,
            data.middleGamma,
            data.attention,
            data.meditation,
        ],
    )
}
