import mysql from 'mysql2/promise'
import { db } from '../db/index.js'
import { decrypt } from '../utils/encryption.js'

interface BackupTargetConnection {
    host: string
    port: number
    database: string
    user: string
    password: string
}

const getBackupTargetConnection = (
    backupTargetId: number
): BackupTargetConnection => {
    const target = db
        .prepare(`
      SELECT
        host,
        port,
        database_name,
        username,
        password
      FROM backup_targets
      WHERE id = ?
    `)
        .get(backupTargetId) as
        | {
            host: string
            port: number
            database_name: string
            username: string
            password: string
        }
        | undefined

    if (!target) {
        throw new Error('Backup target tidak ditemukan.')
    }

    return {
        host: target.host,
        port: target.port,
        database: target.database_name,
        user: target.username,
        password: decrypt(target.password),
    }
}

export const createMySQLConnection = async (
    backupTargetId: number
) => {
    const config = getBackupTargetConnection(backupTargetId)

    return mysql.createConnection(config)
}

export const testMySQLConnection = async (
    backupTargetId: number
): Promise<boolean> => {
    const connection = await createMySQLConnection(
        backupTargetId
    )

    try {
        await connection.ping()

        return true
    } finally {
        await connection.end()
    }
}