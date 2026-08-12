interface BackupOverviewProps {
    today: number
    thisWeek: number
    thisMonth: number
}

export const BackupOverview = ({
    today,
    thisWeek,
    thisMonth,
}: BackupOverviewProps) => {
    return (
        <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="mb-5">
                <h2 class="text-lg font-semibold text-gray-800">
                    Backup Overview
                </h2>

                <p class="text-sm text-gray-500">
                    Jumlah backup yang berhasil diproses.
                </p>
            </div>

            <div class="grid grid-cols-3 gap-4">
                <div>
                    <p class="text-sm text-gray-500">Hari Ini</p>
                    <p class="mt-1 text-xl font-semibold text-gray-800">
                        {today}
                    </p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Minggu Ini</p>
                    <p class="mt-1 text-xl font-semibold text-gray-800">
                        {thisWeek}
                    </p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Bulan Ini</p>
                    <p class="mt-1 text-xl font-semibold text-gray-800">
                        {thisMonth}
                    </p>
                </div>
            </div>
        </div>
    )
}