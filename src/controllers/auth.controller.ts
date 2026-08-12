import type { Context } from 'hono'
import { loginService } from '../services/auth.service.js'

export const loginController = async (c: Context) => {
    try {
        const body = await c.req.parseBody()

        const email = String(body.email ?? '').trim()
        const password = String(body.password ?? '')

        if (!email || !password) {
            return c.text('Email dan password wajib diisi.', 400)
        }

        const user = loginService({
            email,
            password,
        })

        if (!user) {
            return c.text('Email atau password salah.', 401)
        }

        return c.json({
            success: true,
            message: 'Login berhasil.',
            data: user,
        })
    } catch (error) {
        console.error('LOGIN ERROR:', error)

        return c.json(
            {
                success: false,
                message: 'Terjadi kesalahan pada server.',
            },
            500
        )
    }
}