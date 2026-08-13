import 'dotenv/config'

const encryptionKey = process.env.BACKUP_ENCRYPTION_KEY
const tokenBotTelegram = process.env.TOKEN_BOT_TELEGRAM
const chatIdGroupTelegram = process.env.CHAT_ID_GROUP_TELEGRAM

if (!encryptionKey) {
    throw new Error('BACKUP_ENCRYPTION_KEY belum diset di file .env')
}

if (!tokenBotTelegram) {
    throw new Error('TOKEN_BOT_TELEGRAM belum diset di file .env')
}

if (!chatIdGroupTelegram) {
    throw new Error('CHAT_ID_GROUP_TELEGRAM belum diset di file .env')
}

export const env = {
    backupEncryptionKey: Buffer.from(encryptionKey, 'hex'),
    tokenBotTelegram,
    chatIdGroupTelegram,
}