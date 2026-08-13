import type { Context } from 'hono'
import {
    createBackupTarget,
    deleteBackupTarget,
    getBackupTargetById,
    getBackupTargets,
    updateBackupTarget,
} from '../services/backup-target.service.js'

export const createBackupTargetController = async (c: Context) => {
    try {
        const body = await c.req.json<{
            databaseName?: string
            host?: string
            port?: number
            username?: string
            password?: string
        }>()

        if (
            !body.databaseName ||
            !body.host ||
            !body.port ||
            !body.username ||
            !body.password
        ) {
            return c.json(
                {
                    success: false,
                    message: 'Semua field wajib diisi.',
                },
                400
            )
        }

        const target = createBackupTarget({
            databaseName: body.databaseName.trim(),
            host: body.host.trim(),
            port: Number(body.port),
            username: body.username.trim(),
            password: body.password,
        })

        return c.json(
            {
                success: true,
                message: 'Backup target berhasil dibuat.',
                data: target,
            },
            201
        )
    } catch (error) {
        console.error('Create backup target error:', error)

        return c.json(
            {
                success: false,
                message: 'Gagal membuat backup target.',
            },
            500
        )
    }
}

export const getBackupTargetsController = (c: Context) => {
    try {
        const targets = getBackupTargets()

        return c.json({
            success: true,
            data: targets,
        })
    } catch (error) {
        console.error('Get backup targets error:', error)

        return c.json(
            {
                success: false,
                message: 'Gagal mengambil backup targets.',
            },
            500
        )
    }
}

export const getBackupTargetByIdController = (c: Context) => {
    try {
        const id = Number(c.req.param('id'))

        if (!Number.isInteger(id) || id <= 0) {
            return c.json(
                {
                    success: false,
                    message: 'ID tidak valid.',
                },
                400
            )
        }

        const target = getBackupTargetById(id)

        if (!target) {
            return c.json(
                {
                    success: false,
                    message: 'Backup target tidak ditemukan.',
                },
                404
            )
        }

        return c.json({
            success: true,
            data: target,
        })
    } catch (error) {
        console.error('Get backup target error:', error)

        return c.json(
            {
                success: false,
                message: 'Gagal mengambil backup target.',
            },
            500
        )
    }
}

export const updateBackupTargetController = async (c: Context) => {
    try {
        const id = Number(c.req.param('id'))

        if (!Number.isInteger(id) || id <= 0) {
            return c.json(
                {
                    success: false,
                    message: 'ID tidak valid.',
                },
                400
            )
        }

        const body = await c.req.json<{
            databaseName?: string
            host?: string
            port?: number
            username?: string
            password?: string
        }>()

        if (
            !body.databaseName ||
            !body.host ||
            !body.port ||
            !body.username
        ) {
            return c.json(
                {
                    success: false,
                    message: 'Semua field wajib diisi.',
                },
                400
            )
        }

        const target = updateBackupTarget(id, {
            databaseName: body.databaseName.trim(),
            host: body.host.trim(),
            port: Number(body.port),
            username: body.username.trim(),
            password: body.password,
        })

        if (!target) {
            return c.json(
                {
                    success: false,
                    message: 'Backup target tidak ditemukan.',
                },
                404
            )
        }

        return c.json({
            success: true,
            message: 'Backup target berhasil diperbarui.',
            data: target,
        })
    } catch (error) {
        console.error('Update backup target error:', error)

        return c.json(
            {
                success: false,
                message: 'Gagal memperbarui backup target.',
            },
            500
        )
    }
}

export const deleteBackupTargetController = (c: Context) => {
    try {
        const id = Number(c.req.param('id'))

        if (!Number.isInteger(id) || id <= 0) {
            return c.json(
                {
                    success: false,
                    message: 'ID tidak valid.',
                },
                400
            )
        }

        const deleted = deleteBackupTarget(id)

        if (!deleted) {
            return c.json(
                {
                    success: false,
                    message: 'Backup target tidak ditemukan.',
                },
                404
            )
        }

        return c.json({
            success: true,
            message: 'Backup target berhasil dihapus.',
        })
    } catch (error) {
        console.error('Delete backup target error:', error)

        return c.json(
            {
                success: false,
                message: 'Gagal menghapus backup target.',
            },
            500
        )
    }
}