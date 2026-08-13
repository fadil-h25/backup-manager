export interface BackupTargetItem {
    id: number
    databaseName: string
    host: string
    port: number
    username: string
    status: 'Connected' | 'Unknown'
}

interface BackupTargetListProps {
    targets: BackupTargetItem[]
}

export const BackupTargetList = ({
    targets,
}: BackupTargetListProps) => {
    return (
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
                                Port
                            </th>

                            <th class="px-5 py-3 text-left font-medium text-gray-500">
                                Username
                            </th>

                            <th class="px-5 py-3 text-left font-medium text-gray-500">
                                Status
                            </th>

                            <th class="px-5 py-3 text-right font-medium text-gray-500">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {targets.map((target) => (
                            <tr
                                key={target.id}
                                class="border-b border-gray-100 last:border-b-0"
                            >
                                <td class="px-5 py-4 font-medium text-gray-800">
                                    {target.databaseName}
                                </td>

                                <td class="px-5 py-4 text-gray-600">
                                    {target.host}
                                </td>

                                <td class="px-5 py-4 text-gray-600">
                                    {target.port}
                                </td>

                                <td class="px-5 py-4 text-gray-600">
                                    {target.username}
                                </td>

                                <td class="px-5 py-4">
                                    <span
                                        id={`status-${target.id}`}
                                        class={
                                            target.status === 'Connected'
                                                ? 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700'
                                                : 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600'
                                        }
                                    >
                                        {target.status}
                                    </span>
                                </td>

                                <td class="px-5 py-4">
                                    <div class="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onclick={`
                                                const btn = this;
                                                const badge = document.getElementById('status-${target.id}');
                                                btn.disabled = true;
                                                const originalText = btn.innerText;
                                                btn.innerText = 'Testing...';
                                                
                                                badge.innerText = 'Connecting...';
                                                badge.className = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-700';

                                                fetch('/api/backup-targets/${target.id}/test-connection')
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        alert(data.message);
                                                        if (data.success) {
                                                            badge.innerText = 'Connected';
                                                            badge.className = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700';
                                                        } else {
                                                            badge.innerText = 'Disconnected';
                                                            badge.className = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700';
                                                        }
                                                    })
                                                    .catch(err => {
                                                        alert('Terjadi kesalahan koneksi.');
                                                        badge.innerText = 'Failed';
                                                        badge.className = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700';
                                                        console.error(err);
                                                    })
                                                    .finally(() => {
                                                        btn.disabled = false;
                                                        btn.innerText = originalText;
                                                    });
                                            `}
                                            class="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            Test Koneksi
                                        </button>

                                        <a
                                            href={`/backup-targets/${target.id}/edit`}
                                            class="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50"
                                        >
                                            Edit
                                        </a>

                                        <button
                                            type="button"
                                            onclick={`if (confirm('Apakah Anda yakin ingin menghapus backup target ini?')) { fetch('/api/backup-targets/${target.id}', { method: 'DELETE' }).then(res => res.json()).then(data => { if (data.success) { alert(data.message); window.location.reload(); } else { alert(data.message || 'Gagal menghapus'); } }).catch(err => { alert('Terjadi kesalahan'); console.error(err); }); }`}
                                            class="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}