import { db } from '../db/index.js'
import {
    mapBackupTarget,
    type BackupTarget,
    type CreateBackupTargetInput,
    type UpdateBackupTargetInput
} from '../types/target-backup.type.js'
import { encrypt } from '../utils/encryption.js'
import { logger } from '../utils/logger.js'


export const createBackupTarget = (
    input: CreateBackupTargetInput
): BackupTarget => {
    logger.debug('createBackupTarget() called')

    const encryptedPassword = encrypt(input.password)

    const result = db
        .prepare(`
            INSERT INTO backup_targets (
                database_name,
                host,
                port,
                username,
                password
            )
            VALUES (?, ?, ?, ?, ?)
        `)
        .run(
            input.databaseName,
            input.host,
            input.port,
            input.username,
            encryptedPassword,
        )

    const target = getBackupTargetById(
        Number(result.lastInsertRowid)
    )!

    logger.info(
        `[Backup Target] Target berhasil dibuat: ${target.databaseName}`
    )

    return target
}


export const getBackupTargets = (): BackupTarget[] => {
    logger.debug('getBackupTargets() called')

    const rows = db
        .prepare(`
            SELECT
                id,
                database_name,
                host,
                port,
                username,
                password,
                created_at,
                updated_at
            FROM backup_targets
            ORDER BY id DESC
        `)
        .all() as Array<{
            id: number
            database_name: string
            host: string
            port: number
            username: string
            password: string
            created_at: string
            updated_at: string
        }>

    const targets = rows.map(mapBackupTarget)

    logger.info(
        `[Backup Target] Ditemukan ${targets.length} backup target.`
    )

    return targets
}


export const getBackupTargetById = (
    id: number
): BackupTarget | null => {
    logger.debug(
        `getBackupTargetById(${id}) called`
    )

    const row = db
        .prepare(`
            SELECT
                id,
                database_name,
                host,
                port,
                username,
                password,
                created_at,
                updated_at
            FROM backup_targets
            WHERE id = ?
        `)
        .get(id) as
        | {
            id: number
            database_name: string
            host: string
            port: number
            username: string
            password: string
            created_at: string
            updated_at: string
        }
        | undefined

    return row
        ? mapBackupTarget(row)
        : null
}


export const updateBackupTarget = (
    id: number,
    input: UpdateBackupTargetInput
): BackupTarget | null => {
    logger.debug(
        `updateBackupTarget(${id}) called`
    )

    if (input.password) {
        const encryptedPassword = encrypt(input.password)

        const result = db
            .prepare(`
                UPDATE backup_targets
                SET
                    database_name = ?,
                    host = ?,
                    port = ?,
                    username = ?,
                    password = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `)
            .run(
                input.databaseName,
                input.host,
                input.port,
                input.username,
                encryptedPassword,
                id
            )

        if (result.changes === 0) {
            return null
        }
    } else {
        const result = db
            .prepare(`
                UPDATE backup_targets
                SET
                    database_name = ?,
                    host = ?,
                    port = ?,
                    username = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `)
            .run(
                input.databaseName,
                input.host,
                input.port,
                input.username,
                id
            )

        if (result.changes === 0) {
            return null
        }
    }

    const target = getBackupTargetById(id)

    if (target) {
        logger.info(
            `[Backup Target] Target berhasil diperbarui: ${target.databaseName}`
        )
    }

    return target
}


export const deleteBackupTarget = (
    id: number
): boolean => {
    logger.debug(
        `deleteBackupTarget(${id}) called`
    )

    const result = db
        .prepare(`
            DELETE FROM backup_targets
            WHERE id = ?
        `)
        .run(id)

    const deleted = result.changes > 0

    if (deleted) {
        logger.info(
            `[Backup Target] Target berhasil dihapus: ${id}`
        )
    }

    return deleted
}