export interface CreateBackupTargetInput {
    databaseName: string
    host: string
    port: number
    username: string
    password: string
}

export interface UpdateBackupTargetInput {
    databaseName: string
    host: string
    port: number
    username: string
    password?: string
}

export interface BackupTarget {
    id: number
    databaseName: string
    host: string
    port: number
    username: string
    password: string
    createdAt: string
    updatedAt: string
}

export const mapBackupTarget = (row: {
    id: number
    database_name: string
    host: string
    port: number
    username: string
    password: string
    created_at: string
    updated_at: string
}): BackupTarget => ({
    id: row.id,
    databaseName: row.database_name,
    host: row.host,
    port: row.port,
    username: row.username,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
})
