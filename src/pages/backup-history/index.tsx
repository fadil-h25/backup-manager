import { AppLayout } from '../../components/layout/AppLayout.js'
import { getBackupHistoryList } from '../../services/backup.service.js'

const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr)
        return date.toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
    } catch {
        return dateStr
    }
}

export const BackupHistoryPage = () => {
    const historyList = getBackupHistoryList()

    return (
        <AppLayout
            title="Backup History"
            currentPath="/backup-history"
        >
            <main class="p-6">
                <div class="max-w-7xl mx-auto">
                    {/* Header */}
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">
                                Riwayat Backup
                            </h1>
                            <p class="text-sm text-gray-500 mt-1">
                                Daftar seluruh aktivitas pencadangan database yang telah dilakukan.
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th class="px-5 py-3 text-left font-medium text-gray-500">
                                            Database
                                        </th>
                                        <th class="px-5 py-3 text-left font-medium text-gray-500">
                                            Host
                                        </th>
                                        <th class="px-5 py-3 text-left font-medium text-gray-500">
                                            Nama File
                                        </th>
                                        <th class="px-5 py-3 text-left font-medium text-gray-500">
                                            Ukuran
                                        </th>
                                        <th class="px-5 py-3 text-left font-medium text-gray-500">
                                            Status
                                        </th>
                                        <th class="px-5 py-3 text-left font-medium text-gray-500">
                                            Waktu dibuat
                                        </th>
                                    </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-100">
                                    {historyList.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                class="px-5 py-8 text-center text-gray-500"
                                            >
                                                Belum ada riwayat backup.
                                            </td>
                                        </tr>
                                    ) : (
                                        historyList.map((history) => (
                                            <tr key={history.id} class="hover:bg-gray-50/50">
                                                <td class="px-5 py-4 font-medium text-gray-800">
                                                    {history.databaseName}
                                                </td>
                                                <td class="px-5 py-4 text-gray-600">
                                                    {history.host}
                                                </td>
                                                <td class="px-5 py-4 text-gray-600 font-mono text-xs max-w-xs truncate" title={history.fileName}>
                                                    {history.fileName}
                                                </td>
                                                <td class="px-5 py-4 text-gray-600">
                                                    {formatBytes(history.fileSize)}
                                                </td>
                                                <td class="px-5 py-4">
                                                    <span
                                                        class={
                                                            history.status.toLowerCase() === 'success'
                                                                ? 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700'
                                                                : 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700'
                                                        }
                                                    >
                                                        {history.status}
                                                    </span>
                                                </td>
                                                <td class="px-5 py-4 text-gray-600">
                                                    {formatDate(history.createdAt)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </AppLayout>
    )
}
