import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { env } from '../config/env.js'

interface TelegramResponse {
    ok: boolean
    description?: string
}

export const sendTelegramDocument = async (
    filePath: string
): Promise<void> => {
    const fileBuffer = await readFile(filePath)

    const fileName = basename(filePath)

    const form = new FormData()

    form.append(
        'chat_id',
        env.chatIdGroupTelegram
    )

    form.append(
        'document',
        new Blob([fileBuffer], {
            type: 'application/sql',
        }),
        fileName
    )

    const url =
        `https://api.telegram.org/bot` +
        `${env.tokenBotTelegram}/sendDocument`

    const response = await fetch(url, {
        method: 'POST',
        body: form,
    })

    const data =
        await response.json() as TelegramResponse

    if (!response.ok || !data.ok) {
        throw new Error(
            data.description ??
            'Gagal mengirim file ke Telegram.'
        )
    }
}