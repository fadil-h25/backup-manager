import type { Context } from 'hono'
import { createBackup, getBackupHistoryList } from '../services/backup.service.js'

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

        const backupResult = await createBackup(
            backupTargetId
        )

        return c.json({
            success: true,
            message: 'Backup berhasil dibuat.',
            data: backupResult.backup,
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

export const getBackupHistoryController = async (c: Context) => {
    try {
        const history = getBackupHistoryList()
        return c.json({
            success: true,
            data: history,
        })
    } catch (error) {
        console.error('Get backup history error:', error)
        return c.json(
            {
                success: false,
                message: 'Gagal mengambil riwayat backup.',
            },
            500
        )
    }
}