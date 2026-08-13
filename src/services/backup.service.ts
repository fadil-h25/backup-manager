import { execFile } from 'node:child_process'
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import { db } from '../db/index.js'
import { getMySQLTargetConfig } from './mysql.service.js'
import { sendTelegramDocument } from './telegram.service.js'

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
    fileName: string
    filePath: string
    fileSize: number
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
    const backup = await generateDatabaseBackup(
        backupTargetId
    )

    const history = await createBackupHistory(
        backupTargetId,
        backup,
        'success'
    )

    await sendTelegramDocument(
        backup.filePath
    )

    return {
        backup,
        history,
    }
}

export const generateDatabaseBackup = async (
    backupTargetId: number
): Promise<BackupResult> => {
    const config = getMySQLTargetConfig(
        backupTargetId
    )

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

    return {
        fileName,
        filePath,
    }
}

export const createBackupHistory = async (
    backupTargetId: number,
    backup: BackupResult,
    status: string
): Promise<BackupHistory> => {
    const fileStats = await stat(
        backup.filePath
    )

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
            backup.fileName,
            backup.filePath,
            fileStats.size,
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
            file_name: string
            file_path: string
            file_size: number
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

