export const dashboardStats = {
    totalTargets: 8,
    successfulBackups: 24,
    failedBackups: 2,
    totalBackupSize: '18.4 GB',
}

export const backupOverview = {
    today: 3,
    thisWeek: 15,
    thisMonth: 24,
}

export const recentBackups = [
    {
        id: 1,
        database: 'pegawai',
        host: '192.168.1.10',
        status: 'Success',
        size: '1.8 GB',
        createdAt: '12 Aug 2026, 21:30',
    },
    {
        id: 2,
        database: 'absensi',
        host: '192.168.1.11',
        status: 'Success',
        size: '620 MB',
        createdAt: '12 Aug 2026, 20:45',
    },
    {
        id: 3,
        database: 'inventory',
        host: '192.168.1.12',
        status: 'Failed',
        size: '-',
        createdAt: '12 Aug 2026, 19:20',
    },
]