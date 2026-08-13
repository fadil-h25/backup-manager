import { execFile } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { getMySQLTargetConfig } from './mysql.service.js'

const execFileAsync = promisify(execFile)

const BACKUP_DIR = path.join(
    process.cwd(),
    'backups'
)

export interface BackupResult {
    fileName: string
    filePath: string
}

const sanitizeFileName = (value: string) => {
    return value.replace(/[^a-zA-Z0-9_-]/g, '_')
}

export const generateDatabaseBackup = async (
    backupTargetId: number
): Promise<BackupResult> => {
    const config = getMySQLTargetConfig(backupTargetId)

    await mkdir(BACKUP_DIR, {
        recursive: true,
    })

    const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')

    const databaseName = sanitizeFileName(
        config.database
    )

    const fileName = `backup-${databaseName}-${timestamp}.sql`

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
            timeout: 30000, // 30 seconds timeout
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