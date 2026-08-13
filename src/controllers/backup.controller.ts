import type { Context } from 'hono'
import { createBackup } from '../services/backup.service.js'

export const createBackupController = async (
    c: Context
) => {
    try {
        const backupTargetId = Number(
            c.req.param('id')
        )

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

        const result = await createBackup(
            backupTargetId
        )

        return c.json({
            success: true,
            message: 'Backup berhasil dibuat.',
            data: result,
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