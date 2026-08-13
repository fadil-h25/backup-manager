import type { Context } from 'hono'
import { generateDatabaseBackup } from '../services/backup.service.js'

export const createBackupController = async (
    c: Context
) => {
    try {
        const backupTargetId = Number(c.req.param('id'))

        if (
            !Number.isInteger(backupTargetId) ||
            backupTargetId <= 0
        ) {
            return c.json(
                {
                    success: false,
                    message: 'ID backup target tidak valid.',
                },
                400
            )
        }

        const backup = await generateDatabaseBackup(
            backupTargetId
        )

        return c.json({
            success: true,
            message: 'Backup berhasil dibuat.',
            data: backup,
        })
    } catch (error) {
        console.error('Create backup error:', error)

        return c.json(
            {
                success: false,
                message: 'Gagal membuat backup.',
            },
            500
        )
    }
}