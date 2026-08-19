import { execFile } from 'node:child_process'
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import { db } from '../db/index.js'
import { getMySQLTargetConfig } from './mysql.service.js'
import { sendTelegramDocument } from './telegram.service.js'
import { logger } from '../utils/logger.js'

const execFileAsync = promisify(execFile)

const BACKUP_DIR = path.join(
    process.cwd(),
    'backups'
)

export interface BackupResult {
    fileName: string
    filePath: string
}

export interface BackupHistory {
    id: number
    backupTargetId: number
    fileName: string | null
    filePath: string | null
    fileSize: number | null
    status: string
    createdAt: string
}


const sanitizeFileName = (
    value: string
): string => {
    return value.replace(
        /[^a-zA-Z0-9_-]/g,
        '_'
    )
}

export const createBackup = async (
    backupTargetId: number
) => {
    logger.debug(
        `createBackup(${backupTargetId}) called`
    )

    let backup: BackupResult | null = null

    try {
        backup = await generateDatabaseBackup(
            backupTargetId
        )

        await sendTelegramDocument(
            backup.filePath
        )

        const history = await createBackupHistory(
            backupTargetId,
            backup,
            'success'
        )

        return {
            backup,
            history,
        }
    } catch (error) {
        logger.error(
            error,
            `[Backup] Backup target ${backupTargetId} gagal`
        )

        if (backup) {
            const history = await createBackupHistory(
                backupTargetId,
                backup,
                'failed'
            )

            return {
                backup,
                history,
            }
        }

        const history = await createBackupHistory(
            backupTargetId,
            null,
            'failed'
        )

        return {
            backup: null,
            history,
        }
    }
}

export const generateDatabaseBackup = async (
    backupTargetId: number
): Promise<BackupResult> => {
    logger.debug(
        `generateDatabaseBackup(${backupTargetId}) called`
    )

    const config = getMySQLTargetConfig(
        backupTargetId
    )

    logger.debug({
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        hasPassword: config.password.length > 0,
    }, '[Backup] mysqldump configuration')

    await mkdir(BACKUP_DIR, {
        recursive: true,
    })

    const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')

    const databaseName = sanitizeFileName(
        config.database
    )

    const fileName =
        `backup-${databaseName}-${timestamp}.sql`

    const filePath = path.join(
        BACKUP_DIR,
        fileName
    )

    logger.debug(
        `[Backup] Menjalankan mysqldump: ${fileName}`
    )

    await execFileAsync(
        'mysqldump',
        [
            '--host',
            config.host,
            '--port',
            String(config.port),
            '--user',
            config.user,
            '--single-transaction',
            '--routines',
            '--triggers',
            '--result-file',
            filePath,
            config.database,
        ],
        {
            env: {
                ...process.env,
                MYSQL_PWD: config.password,
            },
        }
    )

    logger.debug(
        `[Backup] mysqldump berhasil: ${filePath}`
    )

    return {
        fileName,
        filePath,
    }
}

export const createBackupHistory = async (
    backupTargetId: number,
    backup: BackupResult | null,
    status: string
): Promise<BackupHistory> => {
    logger.debug(
        `createBackupHistory(${backupTargetId}) called`
    )

    const fileStats = backup
        ? await stat(backup.filePath)
        : null

    const result = db
        .prepare(`
            INSERT INTO backup_history (
                backup_target_id,
                file_name,
                file_path,
                file_size,
                status
            )
            VALUES (?, ?, ?, ?, ?)
        `)
        .run(
            backupTargetId,
            backup?.fileName ?? null,
            backup?.filePath ?? null,
            fileStats?.size ?? null,
            status
        )

    const history = db
        .prepare(`
            SELECT
                id,
                backup_target_id,
                file_name,
                file_path,
                file_size,
                status,
                created_at
            FROM backup_history
            WHERE id = ?
        `)
        .get(
            result.lastInsertRowid
        ) as {
            id: number
            backup_target_id: number
            file_name: string | null
            file_path: string | null
            file_size: number | null
            status: string
            created_at: string
        }

    return {
        id: history.id,
        backupTargetId:
            history.backup_target_id,
        fileName: history.file_name,
        filePath: history.file_path,
        fileSize: history.file_size,
        status: history.status,
        createdAt: history.created_at,
    }
}

export const getBackupHistoryList = (): (
    BackupHistory & {
        databaseName: string
        host: string
    }
)[] => {
    logger.debug(
        'getBackupHistoryList() called'
    )

    const rows = db
        .prepare(`
            SELECT 
                h.id,
                h.backup_target_id,
                h.file_name,
                h.file_path,
                h.file_size,
                h.status,
                h.created_at,
                t.database_name,
                t.host
            FROM backup_history h
            LEFT JOIN backup_targets t
                ON h.backup_target_id = t.id
            ORDER BY h.id DESC
        `)
        .all() as Array<{
            id: number
            backup_target_id: number
            file_name: string | null
            file_path: string | null
            file_size: number | null
            status: string
            created_at: string
            database_name: string | null
            host: string | null
        }>

    return rows.map((r) => ({
        id: r.id,
        backupTargetId: r.backup_target_id,
        fileName: r.file_name,
        filePath: r.file_path,
        fileSize: r.file_size,
        status: r.status,
        createdAt: r.created_at,
        databaseName:
            r.database_name || 'Deleted Target',
        host:
            r.host || 'Unknown',
    }))
}

