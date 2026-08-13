interface StatCardProps {
    label: string
    value: string | number
    description?: string
}

export const StatCard = ({
    label,
    value,
    description,
}: StatCardProps) => {
    return (
        <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p class="text-sm text-gray-500">
                {label}
            </p>

            <p class="mt-2 text-2xl font-bold text-gray-800">
                {value}
            </p>

            {description && (
                <p class="mt-1 text-xs text-gray-400">
                    {description}
                </p>
            )}
        </div>
    )
}