import cron from 'node-cron'
import { env } from '../config/env.js'
import { runBackupJob } from './backup.job.js'

export function startBackupScheduler() {

    cron.schedule(env.backupSchedule, async () => {

        console.log('[Scheduler] Menjalankan backup otomatis...')

        await runBackupJob()

    })

    console.log(
        `[Scheduler] Backup scheduler aktif: ${env.backupSchedule}`
    )
}