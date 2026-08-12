import { AppLayout } from '../../components/layout/AppLayout.js'
import { BackupTargetHeader } from './BackupTargetHeader.js'
import { BackupTargetList } from './BackupTargetList.js'
import { backupTargets } from './data.js'

export const BackupTargetsPage = () => {
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

                    <BackupTargetList targets={backupTargets} />
                </div>
            </main>
        </AppLayout>
    )
}