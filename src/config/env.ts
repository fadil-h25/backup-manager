import 'dotenv/config'

const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY

if (!encryptionKey) {
    throw new Error('BACKUP_ENCRYPTION_KEY belum diset di file .env')
}



export const env = {
    backupEncryptionKey: Buffer.from(encryptionKey, 'hex'),
}