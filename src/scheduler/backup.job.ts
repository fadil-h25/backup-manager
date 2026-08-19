import { getBackupTargets } from '../services/backup-target.service.js'
import { createBackup } from '../services/backup.service.js'
import { logger } from '../utils/logger.js'

export const runBackupJob = async (): Promise<void> => {
    logger.debug('runBackupJob() called')

    const targets = getBackupTargets()

    logger.info(
        `[Backup Job] Menemukan ${targets.length} backup target.`
    )

    for (const target of targets) {
        try {
            logger.info(
                `[Backup Job] Memulai backup target: ${target.databaseName}`
            )

            await createBackup(target.id)

            logger.info(
                `[Backup Job] Backup berhasil: ${target.databaseName}`
            )
        } catch (error) {
            logger.error(
                error,
                `[Backup Job] Backup gagal: ${target.databaseName}`
            )
        }
    }

    logger.info(
        '[Backup Job] Proses backup selesai.'
    )
}