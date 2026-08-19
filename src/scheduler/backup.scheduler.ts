import cron from 'node-cron'
import { env } from '../config/env.js'
import { runBackupJob } from './backup.job.js'
import { logger } from '../utils/logger.js'

export function startBackupScheduler() {
    logger.debug('startBackupScheduler() called')

    cron.schedule(env.backupSchedule, async () => {


        logger.info(
            `[Scheduler] Menjalankan backup otomatis...`
        )

        await runBackupJob()
    })

    logger.info(
        `[Scheduler] Backup scheduler aktif: ${env.backupSchedule}`
    )
}