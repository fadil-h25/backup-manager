import type { PropsWithChildren } from 'hono/jsx'
import { PageHead } from './PageHead.js'
import { PageScripts } from './PageScripts.js'
import { Sidebar } from './Sidebar.js'

interface AppLayoutProps {
    title: string
    currentPath?: string
}

const sidebarItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
    },
    {
        label: 'Backup Targets',
        href: '/backup-targets',
    },
    {
        label: 'Backup History',
        href: '/backup-history',
    },
]

export const AppLayout = ({
    title,
    currentPath,
    children,
}: PropsWithChildren<AppLayoutProps>) => {
    return (
        <html lang="en">
            <PageHead title={title} />

            <body class="min-h-screen bg-gray-100">
                <div class="min-h-screen flex">
                    <Sidebar
                        items={sidebarItems}
                        currentPath={currentPath}
                    />

                    <main class="flex-1 min-w-0">
                        {children}
                    </main>
                </div>

                <PageScripts />
            </body>
        </html>
    )
}