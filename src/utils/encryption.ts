import 'dotenv/config'
import {
    createCipheriv,
    createDecipheriv,
    randomBytes,
} from 'node:crypto'

const KEY = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY!, 'hex')

export const encrypt = (text: string) => {
    const iv = randomBytes(12)

    const cipher = createCipheriv('aes-256-gcm', KEY, iv)

    const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final(),
    ])

    const authTag = cipher.getAuthTag()

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export const decrypt = (text: string) => {
    const [iv, authTag, encrypted] = text.split(':')

    const decipher = createDecipheriv(
        'aes-256-gcm',
        KEY,
        Buffer.from(iv, 'hex')
    )

    decipher.setAuthTag(Buffer.from(authTag, 'hex'))

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted, 'hex')),
        decipher.final(),
    ])

    return decrypted.toString('utf8')
}