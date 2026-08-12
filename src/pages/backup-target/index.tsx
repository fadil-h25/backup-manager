import { AppLayout } from '../../components/layout/AppLayout.js'
import { BackupTargetHeader } from './BackupTargetHeader.js'
import { BackupTargetList } from './BackupTargetList.js'
import { getBackupTargets } from '../../services/backup-target.service.js'

export const BackupTargetsPage = () => {
    const targets = getBackupTargets().map((t) => ({
        id: t.id,
        databaseName: t.databaseName,
        host: t.host,
        port: t.port,
        username: t.username,
        status: 'Unknown' as const,
    }))

    return (
        <AppLayout
            title="Backup Targets"
            currentPath="/backup-targets"
        >
            <main class="p-6" >
                <div class="max-w-7xl mx-auto" >
                    <BackupTargetHeader
                        onCreateHref="/backup-targets/create"
                    />

                    <BackupTargetList targets={targets} />
                </div>
            </main>
        </AppLayout>
    )
}