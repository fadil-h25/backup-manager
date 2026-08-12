import { describe, expect, it } from 'vitest'
import { encrypt, decrypt } from '../../src/utils/encryption.js'

describe('encryption', () => {
    it('should encrypt and decrypt text correctly', () => {
        const password = 'admin123'

        const encrypted = encrypt(password)
        const decrypted = decrypt(encrypted)

        expect(encrypted).not.toBe(password)
        expect(decrypted).toBe(password)
    })

    it('should produce different encrypted values for the same text', () => {
        const password = 'admin123'

        const encrypted1 = encrypt(password)
        const encrypted2 = encrypt(password)

        expect(encrypted1).not.toBe(encrypted2)
    })
})