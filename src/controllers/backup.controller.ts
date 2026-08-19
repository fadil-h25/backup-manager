import type { Context } from 'hono'
import {
    createBackup,
    getBackupHistoryList,
} from '../services/backup.service.js'
import { logger } from '../utils/logger.js'

export const createBackupController = async (
    c: Context
) => {
    logger.debug('createBackupController() called')

    try {
        const backupTargetId = Number(
            c.req.param('id')
        )

        if (
            !Number.isInteger(backupTargetId) ||
            backupTargetId <= 0
        ) {
            logger.warn(
                `[Backup] ID backup target tidak valid: ${c.req.param('id')}`
            )

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

        logger.debug(
            backupResult,
            '[Backup] Hasil createBackup'
        )

        return c.json({
            success: true,
            message: 'Backup berhasil dibuat.',
            data: backupResult.backup,
        })
    } catch (error) {
        logger.error(
            error,
            '[Backup] Gagal membuat backup'
        )

        return c.json(
            {
                success: false,
                message: 'Gagal membuat backup.',
            },
            500
        )
    }
}

export const getBackupHistoryController = async (
    c: Context
) => {
    logger.debug(
        'getBackupHistoryController() called'
    )

    try {
        const history = getBackupHistoryList()

        return c.json({
            success: true,
            data: history,
        })
    } catch (error) {
        logger.error(
            error,
            '[Backup History] Gagal mengambil riwayat backup'
        )

        return c.json(
            {
                success: false,
                message: 'Gagal mengambil riwayat backup.',
            },
            500
        )
    }
}
