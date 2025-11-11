import { DB } from 'sqlite'

let database: DB
let databaseReadonly: DB

const SCHEMA = `--sql
CREATE TABLE IF NOT EXISTS tests (
    test_id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    test_date TEXT NOT NULL,
    UNIQUE(device_id, test_date),
    CHECK (test_date GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]')
);
CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_id INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    theta INTEGER,          low_alpha INTEGER,  high_alpha INTEGER,
    low_beta INTEGER,       high_beta INTEGER,  low_gamma INTEGER,
    middle_gamma INTEGER,   attention INTEGER,  meditation INTEGER,
    FOREIGN KEY(test_id) REFERENCES tests(test_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_records_test_id ON records(test_id);
CREATE INDEX IF NOT EXISTS idx_records_timestamp ON records(timestamp);
`

const name = 'database.sqlite'

new DB(name, { mode: 'create' }).execute(SCHEMA)

export const getDatabase = () => {
    if (!database) {
        database = new DB(name, {
            mode: 'write',
        })
    }
    return database
}

export const getDatabaseReadonly = () => {
    if (!databaseReadonly) {
        databaseReadonly = new DB(name, {
            mode: 'read',
        })
    }
    return databaseReadonly
}
