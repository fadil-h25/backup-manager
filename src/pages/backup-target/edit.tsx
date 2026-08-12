import { AppLayout } from '../../components/layout/AppLayout.js'
import { decrypt } from '../../utils/encryption.js'
import type { BackupTarget } from '../../types/target-backup.type.js'

interface BackupTargetEditPageProps {
    target: BackupTarget
}

export const BackupTargetEditPage = ({ target }: BackupTargetEditPageProps) => {
    let decryptedPassword = ''
    try {
        decryptedPassword = decrypt(target.password)
    } catch (e) {
        console.error('Failed to decrypt password:', e)
    }

    return (
        <AppLayout title="Edit Backup Target" currentPath="/backup-targets">
            <main class="p-6">
                <div class="max-w-xl mx-auto">
                    <div class="mb-6">
                        <a href="/backup-targets" class="text-sm text-blue-600 hover:underline">← Kembali ke daftar</a>
                        <h1 class="text-2xl font-bold text-gray-800 mt-2">Edit Backup Target</h1>
                        <p class="text-sm text-gray-500">Ubah konfigurasi database backup target.</p>
                    </div>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <form id="edit-target-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Database Name</label>
                                <input
                                    type="text"
                                    name="databaseName"
                                    required
                                    value={target.databaseName}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Host</label>
                                <input
                                    type="text"
                                    name="host"
                                    required
                                    value={target.host}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Port</label>
                                <input
                                    type="number"
                                    name="port"
                                    required
                                    value={String(target.port)}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    value={target.username}
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Kosongkan jika tidak ingin mengubah password"
                                    autocomplete="new-password"
                                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div class="flex justify-end gap-3 pt-2">
                                <a
                                    href="/backup-targets"
                                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Batal
                                </a>
                                <button
                                    type="submit"
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white shadow-sm transition"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <script dangerouslySetInnerHTML={{
                __html: `
                document.getElementById('edit-target-form').addEventListener('submit', function(event) {
                    event.preventDefault();
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData.entries());
                    data.port = Number(data.port);
                    
                    fetch('/api/backup-targets/${target.id}', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(res => res.json())
                    .then(resData => {
                        if (resData.success) {
                            alert(resData.message || 'Berhasil memperbarui');
                            window.location.href = '/backup-targets';
                        } else {
                            alert(resData.message || 'Gagal memperbarui');
                        }
                    })
                    .catch(err => {
                        alert('Terjadi kesalahan koneksi');
                        console.error(err);
                    });
                });
            `}} />
        </AppLayout>
    )
}
