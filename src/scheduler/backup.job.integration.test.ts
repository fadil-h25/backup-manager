import { beforeEach, describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'

import { db } from '../db/index.js'
import { encrypt } from '../utils/encryption.js'
import { runBackupJob } from './backup.job.js'

describe('runBackupJob() - integration', () => {

    beforeEach(() => {
        db.prepare(`
            DELETE FROM backup_history
        `).run()

        db.prepare(`
            DELETE FROM backup_targets
        `).run()

        db.prepare(`
            INSERT INTO backup_targets (
                database_name,
                host,
                port,
                username,
                password
            )
            VALUES (?, ?, ?, ?, ?)
        `).run(
            'example',
            'localhost',
            3306,
            'example',
            encrypt('example')
        )
    })

    it('berhasil menjalankan backup untuk seluruh backup target', async () => {
        await runBackupJob()

        const history = db
            .prepare(`
                SELECT
                    id,
                    backup_target_id,
                    file_name,
                    file_path,
                    file_size,
                    status
                FROM backup_history
                ORDER BY id DESC
                LIMIT 1
            `)
            .get() as {
                id: number
                backup_target_id: number
                file_name: string
                file_path: string
                file_size: number
                status: string
            }

        expect(history).toBeDefined()

        expect(history.status)
            .toBe('success')

        expect(history.file_name)
            .toBeTruthy()

        expect(history.file_path)
            .toBeTruthy()

        expect(history.file_size)
            .toBeGreaterThan(0)

        expect(
            existsSync(history.file_path)
        ).toBe(true)
    })

    it('mencatat status failed ketika proses backup gagal', async () => {
        const result = db
            .prepare(`
            INSERT INTO backup_targets (
                database_name,
                host,
                port,
                username,
                password
            )
            VALUES (?, ?, ?, ?, ?)
        `)
            .run(
                'database-tidak-ada',
                'localhost',
                3306,
                'example',
                encrypt('example')
            )

        const backupTargetId =
            Number(result.lastInsertRowid)

        await runBackupJob()

        const history = db
            .prepare(`
            SELECT
                id,
                backup_target_id,
                file_name,
                file_path,
                file_size,
                status
            FROM backup_history
            WHERE backup_target_id = ?
            ORDER BY id DESC
            LIMIT 1
        `)
            .get(backupTargetId) as {
                id: number
                backup_target_id: number
                file_name: string | null
                file_path: string | null
                file_size: number | null
                status: string
            }

        expect(history).toBeDefined()

        expect(history.backup_target_id)
            .toBe(backupTargetId)

        expect(history.status)
            .toBe('failed')
    })
})