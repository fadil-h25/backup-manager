interface SidebarItem {
    label: string
    href: string
}

interface SidebarProps {
    items: SidebarItem[]
    currentPath?: string
}

export const Sidebar = ({
    items,
    currentPath,
}: SidebarProps) => {
    return (
        <aside class="w-64 shrink-0 bg-white border-r border-gray-200">
            <div class="h-16 px-6 flex items-center border-b border-gray-200">
                <div>
                    <h1 class="text-base font-semibold text-gray-900">
                        Backup Manager
                    </h1>

                    <p class="text-xs text-gray-500">
                        Database Backup System
                    </p>
                </div>
            </div>

            <nav class="p-4 space-y-1">
                {items.map((item) => {
                    const isActive = currentPath === item.href

                    return (
                        <a
                            href={item.href}
                            class={
                                isActive
                                    ? 'block px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium'
                                    : 'block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                        >
                            {item.label}
                        </a>
                    )
                })}
            </nav>
        </aside>
    )
}