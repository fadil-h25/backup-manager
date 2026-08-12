import type { BackupTargetItem } from './BackupTargetList.js'

export const backupTargets: BackupTargetItem[] = [
    {
        id: 1,
        databaseName: 'pegawai',
        host: '192.168.1.10',
        port: 3306,
        username: 'backup_user',
        status: 'Connected',
    },
    {
        id: 2,
        databaseName: 'absensi',
        host: '192.168.1.11',
        port: 3306,
        username: 'backup_user',
        status: 'Unknown',
    },
    {
        id: 3,
        databaseName: 'inventory',
        host: 'localhost',
        port: 3306,
        username: 'root',
        status: 'Unknown',
    },
]