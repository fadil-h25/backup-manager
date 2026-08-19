import type { Context } from 'hono'
import { testMySQLConnection } from '../services/mysql.service.js'

export const testMySQLConnectionController = async (
    c: Context
) => {
    try {
        const id = Number(c.req.param('id'))

        if (!Number.isInteger(id) || id <= 0) {
            return c.json(
                {
                    success: false,
                    message: 'ID backup target tidak valid.',
                },
                400
            )
        }

        await testMySQLConnection(id)

        return c.json({
            success: true,
            message: 'Koneksi MySQL berhasil.',
        })
    } catch (error) {
        console.error('MySQL connection test error:', error)

        return c.json(
            {
                success: false,
                message: 'Koneksi MySQL gagal.',
            },
            500
        )
    }
}