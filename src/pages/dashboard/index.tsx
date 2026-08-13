import { AppLayout } from '../../components/layout/AppLayout.js'
import { DashboardHeader } from './DashboardHeader.js'
import { StatCard } from './StatCard.js'
import { BackupOverview } from './BackupOverview.js'
import { RecentBackup } from './RecentBackup.js'

import {
    dashboardStats,
    backupOverview,
    recentBackups,
} from './data.js'

export const DashboardPage = () => {
    return (
        <AppLayout title="Dashboard">
            <main class="min-h-screen bg-gray-100 p-6">
                <div class="max-w-7xl mx-auto">
                    <DashboardHeader />

                    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                        <StatCard
                            label="Backup Targets"
                            value={dashboardStats.totalTargets}
                            description="Database yang terdaftar"
                        />

                        <StatCard
                            label="Successful Backup"
                            value={dashboardStats.successfulBackups}
                            description="Backup berhasil"
                        />

                        <StatCard
                            label="Failed Backup"
                            value={dashboardStats.failedBackups}
                            description="Backup gagal"
                        />

                        <StatCard
                            label="Total Backup Size"
                            value={dashboardStats.totalBackupSize}
                            description="Ukuran seluruh backup"
                        />
                    </section>

                    <section class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                        <div class="xl:col-span-1">
                            <BackupOverview
                                today={backupOverview.today}
                                thisWeek={backupOverview.thisWeek}
                                thisMonth={backupOverview.thisMonth}
                            />
                        </div>

                        <div class="xl:col-span-2">
                            <RecentBackup items={recentBackups} />
                        </div>
                    </section>
                </div>
            </main>
        </AppLayout>
    )
}