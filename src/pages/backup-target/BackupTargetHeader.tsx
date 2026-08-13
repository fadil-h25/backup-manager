interface BackupTargetHeaderProps {
    onCreateHref: string
}

export const BackupTargetHeader = ({
    onCreateHref,
}: BackupTargetHeaderProps) => {
    return (
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">
                    Backup Targets
                </h1>

                <p class="mt-1 text-sm text-gray-500">
                    Kelola database MySQL yang akan dibackup.
                </p>
            </div>

            <a
                href={onCreateHref}
                class="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
                Tambah Target
            </a>
        </div>
    )
}