import bcrypt from 'bcryptjs'
import { db } from '../db/index.js'

export interface LoginInput {
    email: string
    password: string
}

export interface LoginUser {
    id: number
    nama: string
    email: string
}

export const loginService = (input: LoginInput): LoginUser | null => {
    const user = db
        .prepare(`
      SELECT id, nama, email, password
      FROM users
      WHERE email = ?
    `)
        .get(input.email) as
        | {
            id: number
            nama: string
            email: string
            password: string
        }
        | undefined

    // User tidak ditemukan
    if (!user) {
        return null
    }

    // Verifikasi password dengan hash di database
    const isPasswordValid = bcrypt.compareSync(
        input.password,
        user.password
    )

    if (!isPasswordValid) {
        return null
    }

    // Jangan pernah mengembalikan password
    return {
        id: user.id,
        nama: user.nama,
        email: user.email,
    }
}