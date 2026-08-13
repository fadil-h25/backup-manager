// src/services/mysql.service.ts

import mysql from 'mysql2/promise'
import { db } from '../db/index.js'
import { decrypt } from '../utils/encryption.js'

export interface MySQLTargetConfig {
    host: string
    port: number
    database: string
    user: string
    password: string
}

interface BackupTargetRow {
    host: string
    port: number
    database_name: string
    username: string
    password: string
}

/**
 * Mengambil konfigurasi koneksi MySQL
 * berdasarkan backup target yang tersimpan di SQLite.
 */
export const getMySQLTargetConfig = (
    backupTargetId: number
): MySQLTargetConfig => {
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
        .get(backupTargetId) as BackupTargetRow | undefined

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

/**
 * Membuat koneksi MySQL secara dinamis
 * berdasarkan backup target.
 */
export const createMySQLConnection = async (
    backupTargetId: number
) => {
    const config = getMySQLTargetConfig(backupTargetId)

    return mysql.createConnection(config)
}

/**
 * Menguji koneksi ke MySQL target.
 */
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