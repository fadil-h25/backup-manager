import { getBackupTargets } from '../services/backup-target.service.js'
import { createBackup } from '../services/backup.service.js'

export const runBackupJob = async (): Promise<void> => {
    const targets = getBackupTargets()

    console.log(
        `[Backup Job] Menemukan ${targets.length} backup target.`
    )

    for (const target of targets) {
        try {
            console.log(
                `[Backup Job] Memulai backup target: ${target.databaseName}`
            )

            await createBackup(target.id)

            console.log(
                `[Backup Job] Backup berhasil: ${target.databaseName}`
            )
        } catch (error) {
            console.error(
                `[Backup Job] Backup gagal: ${target.databaseName}`,
                error
            )
        }
    }

    console.log('[Backup Job] Proses backup selesai.')
}