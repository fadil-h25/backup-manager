interface RecentBackupItem {
    id: number
    database: string
    host: string
    status: string
    size: string
    createdAt: string
}

interface RecentBackupProps {
    items: RecentBackupItem[]
}

export const RecentBackup = ({
    items,
}: RecentBackupProps) => {
    return (
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div class="p-5 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800">
                    Recent Backup
                </h2>

                <p class="text-sm text-gray-500">
                    Riwayat backup terbaru.
                </p>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="text-left px-5 py-3 font-medium text-gray-500">
                                Database
                            </th>

                            <th class="text-left px-5 py-3 font-medium text-gray-500">
                                Host
                            </th>

                            <th class="text-left px-5 py-3 font-medium text-gray-500">
                                Status
                            </th>

                            <th class="text-left px-5 py-3 font-medium text-gray-500">
                                Size
                            </th>

                            <th class="text-left px-5 py-3 font-medium text-gray-500">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr
                                key={item.id}
                                class="border-t border-gray-100"
                            >
                                <td class="px-5 py-3 font-medium text-gray-800">
                                    {item.database}
                                </td>

                                <td class="px-5 py-3 text-gray-600">
                                    {item.host}
                                </td>

                                <td class="px-5 py-3">
                                    <span
                                        class={
                                            item.status === 'Success'
                                                ? 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700'
                                                : 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700'
                                        }
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td class="px-5 py-3 text-gray-600">
                                    {item.size}
                                </td>

                                <td class="px-5 py-3 text-gray-500">
                                    {item.createdAt}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}